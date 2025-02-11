import { Dict } from '@ebizbase/common-types';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import speakeasy from 'speakeasy';
import { UAParser } from 'ua-parser-js';
import { IRefreshTokenPayload } from '../common/refresh-token-payload.interface';
import { GetOtpInputDTO } from '../dtos/authenticate/get-otp-input.dto';
import { RefreshTokenInputDto } from '../dtos/authenticate/refresh-token-input.dto';
import { RefreshTokenOutputDto } from '../dtos/authenticate/refresh-token-output.dto';
import { VerifyInputDTO } from '../dtos/authenticate/verify-input.dto';
import { VerifyHotpOutputDTO } from '../dtos/authenticate/verify-output.dto';
import { OutPutDto } from '../dtos/output.dto';
import { InjectSessionModel, SessionDocument, SessionModel } from '../schemas/session.schema';
import { InjectUserModel, UserDocument, UserModel } from '../schemas/user.schema';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthenticateService {
  private readonly logger = new Logger(AuthenticateService.name);
  private readonly ACCESS_TOKEN_EXPIRES_IN = ms(process.env['ACCESS_TOKEN_EXPIRES_IN'] || '15m');
  private readonly REFRESH_TOKEN_EXPIRES_IN = ms(process.env['REFRESH_TOKEN_EXPIRES_IN'] || '28d');
  private readonly OTP_EXPIRES_IN = parseInt(process.env['OTP_EXPIRES_IN']) || 10 * 60 * 1000;
  private readonly MAX_IP_HISTORY = parseInt(process.env['MAX_IP_HISTORY']) || 96;

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectSessionModel() private sessionModel: SessionModel,
    @InjectUserModel() private userModel: UserModel
  ) {}

  async getOTP({ email, colorMode, language }: GetOtpInputDTO): Promise<OutPutDto> {
    const now = Date.now();
    let user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.debug('User email does not exist. Creating new user.');
      user = await this.userModel.create({ email, colorMode, language });
    } else if (!user.otpUsed && now - user.otpIssuedAt.getTime() < 60 * 1_000) {
      this.logger.warn('OTP request too frequent.');
      throw new HttpException({ message: 'You requested OTP too fast. Please wait.' }, 429);
    }

    user = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { otpCounter: user.otpCounter + 1, otpUsed: false, otpIssuedAt: new Date() },
      { new: true }
    );

    const otp = speakeasy.hotp({ secret: user.otpSecret, counter: user.otpCounter });
    await this.mailerService.sendOTPEmail(user.email, otp);

    return { message: `OTP sent to ${user.email}. Check your inbox.` };
  }

  async verify(
    { email, otp }: VerifyInputDTO,
    headers: Dict<string>
  ): Promise<VerifyHotpOutputDTO> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Incorrect email');
    }

    if (!(await this.verifyHOTP(user, otp))) {
      throw new BadRequestException('Invalid OTP or expired');
    }

    return { data: { ...user.toObject(), ...(await this.issueNewToken(user.id, headers)) } };
  }

  private async verifyHOTP(user: UserDocument, token: string): Promise<boolean> {
    if (user.otpUsed || Date.now() - user.otpIssuedAt.getTime() > this.OTP_EXPIRES_IN) {
      return false;
    }

    if (!speakeasy.hotp.verify({ secret: user.otpSecret, counter: user.otpCounter, token })) {
      return false;
    }

    await this.userModel.findOneAndUpdate({ _id: user._id }, { otpUsed: true });
    return true;
  }

  async refreshToken(
    { refreshToken }: RefreshTokenInputDto,
    headers: Dict<string>
  ): Promise<RefreshTokenOutputDto> {
    let payload: IRefreshTokenPayload;
    try {
      payload = await this.jwtService.verify(refreshToken);
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const session = await this.sessionModel.findById(payload.sid);
    this.validateSession(session);

    return { data: await this.issueNewToken(session.userId, headers, session) };
  }

  private validateSession(session: SessionDocument) {
    if (!session) {
      throw new ForbiddenException('Session unavailable');
    }
    if (session.expiredAt.getTime() <= Date.now()) {
      throw new ForbiddenException('Session expired');
    }
    if (session.revokedAt) {
      throw new ForbiddenException('Session revoked');
    }
  }

  private async issueNewToken(userId: string, headers: Dict<string>, session?: SessionDocument) {
    const { platform, platformVersion, browser, device } = this.parseUserAgent(headers);
    if (
      session &&
      this.isDifferentDevice(session, { platform, platformVersion, browser, device })
    ) {
      throw new ForbiddenException();
    }

    const clientIP = this.parseClientIp(headers);
    if (session) {
      await this.sessionModel.updateOne(
        { _id: session._id },
        {
          $push: {
            ipHistory: {
              $each: [{ ip: clientIP, timestamp: new Date() }],
              $slice: -this.MAX_IP_HISTORY,
            },
          },
          $set: { expiredAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES_IN) },
        }
      );
    } else {
      session = await this.sessionModel.create({
        userId,
        platform,
        platformVersion,
        browser,
        device,
        ipHistory: [{ ip: clientIP, timestamp: new Date() }],
        expiredAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES_IN),
      });
    }

    return {
      accessToken: await this.jwtService.signAsync(
        { uid: userId, sid: session._id },
        { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN / 1000, noTimestamp: true }
      ),
      refreshToken: await this.jwtService.signAsync(
        { sessionId: session._id },
        { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN / 1000, noTimestamp: true }
      ),
    };
  }

  private parseClientIp(headers: Dict<string>) {
    const ip = headers['x-forwarded-for'] || headers['cf-connecting-ip'];
    if (!ip) {
      this.logger.error({ msg: 'Can not extract user remote ip from headers', headers });
      throw new InternalServerErrorException('Can not get user remote ip');
    }
    return ip;
  }

  private parseUserAgent(headers: Dict<string>) {
    const userAgent = headers['user-agent'];
    if (!userAgent) {
      throw new ForbiddenException();
    }

    const { os, browser, device } = UAParser(userAgent);
    if (!os.name) {
      throw new ForbiddenException();
    }

    return {
      platform: os.name,
      platformVersion: os.version,
      browser: browser.name,
      device: device.vendor ? `${device.vendor} ${device.model || ''}`.trim() : undefined,
    };
  }

  private isDifferentDevice(session: SessionDocument, newDevice: Partial<SessionDocument>) {
    return (
      session.platform !== newDevice.platform ||
      session.platformVersion !== newDevice.platformVersion ||
      session.browser !== newDevice.browser ||
      session.device !== newDevice.device
    );
  }
}

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
  private readonly ACCESS_TOKEN_EXPIRES_IN = process.env['ACCESS_TOKEN_EXPIRES_IN'] || '15m';
  private readonly REFRESH_TOKEN_EXPIRES_IN = process.env['REFRESH_TOKEN_EXPIRES_IN'] || '28d';
  private readonly OTP_EXPIRES_IN = parseInt(process.env['OTP_EXPIRES_IN']) || 10 * 60 * 1000;
  private readonly MAX_IP_HISTORY = parseInt(process.env['MAX_IP_HISTORY']) || 96;

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectSessionModel() private sessionModel: SessionModel,
    @InjectUserModel() private userModel: UserModel
  ) {}

  async getOTP({ email, colorMode, language }: GetOtpInputDTO): Promise<OutPutDto> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.debug('User email is not exist on system');
      user = await this.userModel.create({ email, colorMode, language });
      const otp = speakeasy.hotp({ secret: user.otpSecret, counter: user.otpCounter });
      await this.mailerService.sendOTPEmail(user.email, otp);
      return { message: 'OTP email sent successfully' };
    } else {
      this.logger.debug('User exist on system');
      const lastIssueSince = Date.now() - user.otpIssuedAt.getTime();
      if (!user.otpUsed && lastIssueSince < 60 * 1_000) {
        this.logger.debug('Send otp too fast');
        throw new HttpException(
          { message: 'You requested to send OTP too fast please wait a moment' },
          429
        );
      }
      user = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          otpCounter: user.otpCounter + 1,
          otpUsed: false,
          otpIssuedAt: new Date(),
        },
        {
          new: true,
        }
      );
      const otp = speakeasy.hotp({ secret: user.otpSecret, counter: user.otpCounter });
      await this.mailerService.sendOTPEmail(user.email, otp);
      return {
        message: `An email has been sent to ${user.email}. Check your inbox for our email! If it is not there, look in your spam/junk folder and mark it as "Not Spam" to receive future messages smoothly.`,
      };
    }
  }

  async verify(
    { email, otp }: VerifyInputDTO,
    headers: Dict<string>
  ): Promise<VerifyHotpOutputDTO> {
    this.logger.debug({ msg: 'Verifying Identify', email, otp });
    const user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.warn({ msg: 'Verify user with email not found', email });
      throw new BadRequestException({ message: 'Incorrect email' });
    }

    if (!(await this.verifyHOTP(user, otp))) {
      this.logger.debug(`Invalid OTP for user with email ${email}`);
      throw new BadRequestException({ message: 'Invalid OTP or expired' });
    }

    const data = {
      ...user.toObject(),
      ...(await this.issueNewToken(user.id, headers)),
    };

    this.logger.debug({ msg: 'Verifying Identify Response', data });

    return { data };
  }

  async verifyHOTP(user: UserDocument, token: string): Promise<boolean> {
    this.logger.debug({ msg: 'Verifying HOTP', user, token });

    if (user.otpUsed) {
      this.logger.debug('OTP is ussed');
      return false;
    }

    if (Date.now() - user.otpIssuedAt.getTime() > this.OTP_EXPIRES_IN) {
      this.logger.debug('OTP expired');
      return false;
    }

    if (!speakeasy.hotp.verify({ secret: user.otpSecret, counter: user.otpCounter, token })) {
      this.logger.debug('OTP is invalid');
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
      throw new ForbiddenException({ message: 'Invalid refreshToken' });
    }

    if (!payload.sessionId) {
      throw new ForbiddenException('Invalid refreshToken payload');
    }

    const session = await this.sessionModel.findById(payload.sessionId);

    if (!session) {
      throw new ForbiddenException('Session is unavaiable');
    } else if (session.expiredAt.getTime() <= Date.now()) {
      throw new ForbiddenException('Session is expired');
    } else if (session.revokedAt !== undefined && session.revokedAt !== null) {
      throw new ForbiddenException('Session is revoked');
    }

    return {
      data: await this.issueNewToken(session.userId, headers, session),
    };
  }

  private async issueNewToken(userId: string, headers: Dict<string>, session?: SessionDocument) {
    const userAgent = headers['user-agent'];
    const clientIP = headers['x-forwarded-for'] || headers['cf-connecting-ip'];
    let device: string | undefined;
    let flatform: string;
    let flatformVersion: string;
    let browser: string;

    if (!clientIP) {
      this.logger.error({ msg: 'Can not extract user remote ip from headers', headers });
      throw new InternalServerErrorException('Can not get user remote ip');
    } else if (!userAgent) {
      this.logger.warn({ msg: 'Request without user agent header', headers, ip: clientIP });
      throw new ForbiddenException();
    } else {
      const uaParserResult = UAParser(userAgent);

      if (!uaParserResult.os.name) {
        this.logger.warn({
          msg: 'Request user agent can not detect flatform',
          headers,
          uaParserResult,
          ip: clientIP,
        });
        throw new ForbiddenException();
      }

      flatform = uaParserResult.os.name;
      flatformVersion = uaParserResult.os.version;
      browser = uaParserResult.browser.name;
      if (uaParserResult.device.vendor) {
        if (uaParserResult.device.model) {
          device = `${uaParserResult.device.vendor} ${uaParserResult.device.model}`;
        } else {
          device = `${uaParserResult.device.vendor}`;
        }
      }
    }

    const now = Date.now();
    const accessTokenExpiresAt = new Date(now + ms(this.ACCESS_TOKEN_EXPIRES_IN));
    const refreshTokenExpiresAt = new Date(now + ms(this.REFRESH_TOKEN_EXPIRES_IN));

    if (session) {
      if (
        session.flatform !== flatform ||
        session.flatformVersion !== flatformVersion ||
        session.browser !== browser ||
        session.device !== device
      ) {
        this.logger.warn({
          msg: `Blocked session update: User ${userId} tried to access from a different device.`,
          detect: { flatform, flatformVersion, browser, device },
          session,
        });
        throw new ForbiddenException();
      } else {
        const updateResult = await this.sessionModel.updateOne(
          { _id: session._id },
          {
            $push: {
              ipHistory: {
                $each: [{ ip: clientIP, timestamp: new Date() }],
                $slice: -this.MAX_IP_HISTORY,
              },
            },
            $set: { expiredAt: refreshTokenExpiresAt },
          }
        );
        if (updateResult.modifiedCount === 0) {
          this.logger.warn(`Failed to update session for user ${userId}`);
        }
      }
    } else {
      session = await this.sessionModel.create({
        userId,
        flatform,
        flatformVersion,
        browser,
        device,
        ipHistory: [{ ip: clientIP, timestamp: new Date() }],
        expiredAt: refreshTokenExpiresAt,
      });
    }

    const accessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = await this.jwtService.signAsync(
      { sessionId: session.id },
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}

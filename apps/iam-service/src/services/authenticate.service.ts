import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { ITransactionalMail } from '@ebizbase/mail-interfaces';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import speakeasy from 'speakeasy';
import { GetOtpInputDTO } from '../dtos/get-otp-input.dto';
import { VerifyInputDTO } from '../dtos/verify-input.dto';
import { VerifyOutputDTO } from '../dtos/verify-output.dto';
import { InjectSessionModel, SessionModel } from '../schemas/session.schema';
import { InjectUserModel, UserDocument, UserModel } from '../schemas/user.schema';

@Injectable()
export class AuthenticateService {
  private readonly logger = new Logger(AuthenticateService.name);
  private readonly ACCESS_TOKEN_EXPIRES_IN = process.env['ACCESS_TOKEN_EXPIRES_IN'] || '15m';
  private readonly REFRESH_TOKEN_EXPIRES_IN = process.env['REFRESH_TOKEN_EXPIRES_IN'] || '7d';
  private readonly OTP_EXPIRES_IN = parseInt(process.env['OTP_EXPIRES_IN']) || 10 * 60 * 1000;

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly jwtService: JwtService,
    @InjectSessionModel() private sessionModel: SessionModel,
    @InjectUserModel() private userModel: UserModel
  ) {}

  async getOTP({ email }: GetOtpInputDTO): Promise<IRestfulResponse> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = await this.userModel.create({ email });
      const otp = speakeasy.hotp({ secret: user.otpSecret, counter: user.otpCounter });
      await this.sendOtpEmail(user.email, otp);
    } else if (user.otpUsed || Date.now() - user.otpIssuedAt.getTime() > 60 * 10000) {
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
      await this.sendOtpEmail(user.email, otp);
    }
    return {};
  }

  async verify(
    { email, otp }: VerifyInputDTO,
    headers: Dict<string>
  ): Promise<IRestfulResponse<VerifyOutputDTO>> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn({ msg: 'Verify user with email not found', email });
      throw new BadRequestException({ message: 'Incorrect email' });
    }

    if (!(await this.verifyHOTP(user, otp))) {
      this.logger.debug(`Invalid OTP for user with email ${email}`);
      throw new BadRequestException({ message: 'Invalid OTP or expired' });
    }
    await this.userModel.findOneAndUpdate({ _id: user._id }, { otpUsed: true });
    return { data: await this.issueNewToken(user.id, headers) };
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

    return true;
  }

  private async issueNewToken(userId: string, headers: Dict<string>) {
    const userAgent = headers['user-agent'];
    const ipAddress = headers['x-forwarded-for'] || headers['cf-connecting-ip'];

    if (!userAgent) {
      throw new UnauthorizedException('User-Agent header is missing');
    } else if (!ipAddress) {
      this.logger.error({ msg: 'Can not extract user remote ip from headers', headers });
      throw new InternalServerErrorException('Can not get user remote ip');
    }

    const now = Date.now();
    const accessTokenExpiresAt = new Date(now + ms(this.ACCESS_TOKEN_EXPIRES_IN));
    const refreshTokenExpiresAt = new Date(now + ms(this.REFRESH_TOKEN_EXPIRES_IN));

    const session = await this.sessionModel.create({
      userId,
      userAgent,
      ipAddress,
      expiredAt: refreshTokenExpiresAt,
    });

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

  async sendOtpEmail(email: string, otp: string) {
    const transactionalMail: ITransactionalMail = {
      event: 'account-otp',
      to: email,
      data: { otp },
    };
    await this.amqpConnection.publish(
      'transactional_mail_exchange',
      'send',
      Buffer.from(JSON.stringify(transactionalMail))
    );
  }
}

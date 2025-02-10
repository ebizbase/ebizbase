import { Dict } from '@ebizbase/common-types';
import { SerializeInterceptor } from '@ebizbase/nestjs-serial';
import { Body, Controller, Headers, HttpCode, Logger, Post, UseInterceptors } from '@nestjs/common';
import { GetOtpInputDTO } from '../dtos/authenticate/get-otp-input.dto';
import { RefreshTokenInputDto } from '../dtos/authenticate/refresh-token-input.dto';
import { RefreshTokenOutputDto } from '../dtos/authenticate/refresh-token-output.dto';
import { VerifyInputDTO } from '../dtos/authenticate/verify-input.dto';
import { VerifyHotpOutputDTO } from '../dtos/authenticate/verify-output.dto';
import { OutPutDto } from '../dtos/output.dto';
import { AuthenticateService } from '../services/authenticate.service';

@Controller('authenticate')
export class AuthenticateController {
  private logger = new Logger(AuthenticateController.name);

  constructor(private authenticateService: AuthenticateService) {}

  @Post('/get-otp')
  @HttpCode(200)
  @UseInterceptors(new SerializeInterceptor(OutPutDto))
  async getOtp(@Body() body: GetOtpInputDTO): Promise<OutPutDto> {
    this.logger.debug({ msg: 'Get OTP', body });
    return this.authenticateService.getOTP(body);
  }

  @Post('/verify')
  @HttpCode(200)
  @UseInterceptors(new SerializeInterceptor(VerifyHotpOutputDTO))
  async verify(
    @Body() body: VerifyInputDTO,
    @Headers() headers: Dict<string>
  ): Promise<VerifyHotpOutputDTO> {
    this.logger.debug({ msg: 'Verify identity', body });
    return this.authenticateService.verify(body, headers);
  }

  @Post('/refresh-token')
  @HttpCode(200)
  @UseInterceptors(new SerializeInterceptor(RefreshTokenOutputDto))
  async refresh(
    @Body() body: RefreshTokenInputDto,
    @Headers() headers: Dict<string>
  ): Promise<RefreshTokenOutputDto> {
    this.logger.debug({ msg: 'RefreshToken', body });
    return this.authenticateService.refreshToken(body, headers);
  }
}

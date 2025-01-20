import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { Body, Controller, Headers, HttpCode, Logger, Post } from '@nestjs/common';
import { GetOtpInputDTO } from '../dtos/authenticate/get-otp-input.dto';
import { VerifyHotpInputDTO } from '../dtos/authenticate/verify-input.dto';
import { VerifyHotpOutputDTO } from '../dtos/authenticate/verify-output.dto';
import { AuthenticateService } from '../services/authenticate.service';

@Controller('authenticate')
export class AuthenticateController {
  private logger = new Logger(AuthenticateController.name);

  constructor(private authenticateService: AuthenticateService) {}

  @Post('/get-otp')
  @HttpCode(200)
  async getOtp(@Body() body: GetOtpInputDTO): Promise<IRestfulResponse> {
    this.logger.debug({ msg: 'Get OTP', body });
    return this.authenticateService.getOTP(body);
  }

  @Post('/verify-hotp')
  @HttpCode(200)
  async verify(
    @Body() body: VerifyHotpInputDTO,
    @Headers() headers: Dict<string>
  ): Promise<IRestfulResponse<VerifyHotpOutputDTO>> {
    this.logger.debug({ msg: 'Verify identity', body });
    return this.authenticateService.verify(body, headers);
  }

  @Post('/refresh-token')
  @HttpCode(200)
  async refresh(
    @Body() body: VerifyHotpInputDTO,
    @Headers() headers: Dict<string>
  ): Promise<IRestfulResponse<VerifyHotpOutputDTO>> {
    this.logger.debug({ msg: 'RefreshToken', body });
    return this.authenticateService.verify(body, headers);
  }
}

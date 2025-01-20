import { IVerifyHotpRequest } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class VerifyHotpInputDTO implements IVerifyHotpRequest {
  @IsString()
  email: string;
  @IsString()
  otp: string;
}

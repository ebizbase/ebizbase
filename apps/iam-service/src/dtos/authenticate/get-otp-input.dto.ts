import { IGetOtpRequest } from '@ebizbase/iam-interfaces';
import { IsEmail, IsString } from 'class-validator';

export class GetOtpInputDTO implements IGetOtpRequest {
  @IsString()
  @IsEmail()
  email: string;
}

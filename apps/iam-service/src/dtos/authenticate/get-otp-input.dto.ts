import { IGetOtpRequest } from '@ebizbase/iam-interfaces';
import { IsEmail, IsString } from 'class-validator';

export class GetOtpInputDTO implements Omit<IGetOtpRequest, 'language' | 'colorMode'> {
  @IsString()
  @IsEmail()
  email: string;
}

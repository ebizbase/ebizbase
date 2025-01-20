import { IGetOtpRequest } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class GetOtpInputDTO implements IGetOtpRequest {
  @IsString()
  email: string;
}

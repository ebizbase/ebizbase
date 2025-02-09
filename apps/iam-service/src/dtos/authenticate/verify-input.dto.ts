import { IVerifyRequest } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class VerifyInputDTO implements IVerifyRequest {
  @IsString()
  email: string;
  @IsString()
  otp: string;
}

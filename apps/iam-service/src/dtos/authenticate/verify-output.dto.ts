import { IVerifyHotpResponse } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class VerifyHotpOutputDTO implements IVerifyHotpResponse {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

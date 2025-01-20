import { IRefreshTokenResponse } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class RefreshTokenOutputDto implements IRefreshTokenResponse {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

import { IRefreshTokenRequest } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class RefreshTokenInputDto implements IRefreshTokenRequest {
  @IsString()
  refreshToken: string;
}

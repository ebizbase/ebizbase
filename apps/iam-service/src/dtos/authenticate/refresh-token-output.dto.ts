import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { IVerifyResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';

export class RefreshTokenOuputData implements IVerifyResponse {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class RefreshTokenOutputDto implements IRestfulResponse<RefreshTokenOuputData> {
  @Expose()
  message?: string;

  @Expose()
  errors?: Dict<string>;

  @Expose()
  @Type(() => RefreshTokenOuputData)
  data: RefreshTokenOuputData;
}

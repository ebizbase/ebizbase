import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { IVerifyResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';

export class VerifyHotpOuputData implements IVerifyResponse {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class VerifyHotpOutputDTO implements IRestfulResponse<VerifyHotpOuputData> {
  @Expose()
  message?: string;

  @Expose()
  errors?: Dict<string>;

  @Expose()
  @Type(() => VerifyHotpOuputData)
  data: VerifyHotpOuputData;
}

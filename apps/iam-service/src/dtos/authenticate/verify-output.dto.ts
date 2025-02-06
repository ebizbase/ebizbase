import { IRestfulResponse } from '@ebizbase/common-types';
import { IVerifyHotpResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';

export class VerifyHotpOuputData implements IVerifyHotpResponse {
  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class VerifyHotpOutputDTO implements IRestfulResponse<VerifyHotpOuputData> {
  @Expose()
  message?: string;

  @Expose()
  @Type(() => VerifyHotpOuputData)
  data: VerifyHotpOuputData;
}

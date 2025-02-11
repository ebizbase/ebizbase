import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';

export class MeBasicInfoOutputData implements IMeBasicInfoResponse {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  avatar?: string;
}

export class MeBasicInfoOutputDto implements IRestfulResponse<MeBasicInfoOutputData> {
  @Expose()
  message?: string;

  @Expose()
  errors?: Dict<string>;

  @Expose()
  @Type(() => MeBasicInfoOutputData)
  data: MeBasicInfoOutputData;
}

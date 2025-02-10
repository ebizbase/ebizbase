import { ColorMode, Dict, IRestfulResponse, Language } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';

export class MeBasicInfoOutputData implements IMeBasicInfoResponse {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  avatar?: string;

  @Expose()
  colorMode: ColorMode;

  @Expose()
  language: Language;
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

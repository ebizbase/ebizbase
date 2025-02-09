import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { VerifyHotpOuputData } from '../authenticate/verify-output.dto';

export class MeBasicInfoOutputDto implements IMeBasicInfoResponse {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  avatar?: string;
}

export class VerifyHotpOutputDTO implements IRestfulResponse<MeBasicInfoOutputDto> {
  @Expose()
  message?: string;

  @Expose()
  errors?: Dict<string>;

  @Expose()
  @Type(() => VerifyHotpOuputData)
  data: MeBasicInfoOutputDto;
}

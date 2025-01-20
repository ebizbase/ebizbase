import { IMeResponse } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class MeOutputDto implements IMeResponse {
  @IsString()
  firstName: string;
  @IsString()
  lastName?: string;
}

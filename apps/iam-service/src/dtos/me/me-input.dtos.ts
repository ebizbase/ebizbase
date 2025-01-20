import { IMeRequest } from '@ebizbase/iam-interfaces';
import { IsString } from 'class-validator';

export class MeInputDto implements IMeRequest {
  @IsString()
  firstName: string;

  @IsString()
  lastName?: string;
}

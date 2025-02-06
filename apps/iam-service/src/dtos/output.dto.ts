import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { Expose } from 'class-transformer';

export class OutPutDto<T = undefined> implements IRestfulResponse<T> {
  @Expose()
  message?: string;
  @Expose()
  errors?: Dict<string>;
  @Expose()
  data?: T;
}

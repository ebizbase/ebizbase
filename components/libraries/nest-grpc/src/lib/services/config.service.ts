import { Dict } from '@ebizbase/common-types';

export class ConfigService {
  constructor(private readonly envConfig: Dict<string>) {}

  get<T>(key: keyof T): T[keyof T] {
    return this.envConfig[key as string] as T[keyof T];
  }
}

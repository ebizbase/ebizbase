import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common';

export abstract class ConfigSchema {
  imports(): Array<DynamicModule | Type<unknown> | ForwardReference> {
    return [];
  }

  providers(): Provider[] {
    return [];
  }
}

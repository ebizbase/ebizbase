import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Translator } from './translator';
import { TranslatorInterceptor } from './translator.interceptor';

export const DEFAULT_LANGUAGE = 'DEFAULT_LANGUAGE';

export interface TranslatorOptions {
  translator: Translator;
}

export interface TranslatorAsyncOptions {
  useFactory: (...args: unknown[]) => Promise<TranslatorOptions> | TranslatorOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  imports?: Array<Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
}

@Module({})
export class TranslatorModule {
  public static registerAsync(options: TranslatorAsyncOptions): DynamicModule {
    return {
      module: TranslatorModule,
      imports: options.imports || [],
      providers: [
        {
          provide: options.useFactory,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: Translator,
          useFactory: async (opts: TranslatorOptions) => opts.translator,
          inject: [options.useFactory],
        },
        {
          provide: APP_INTERCEPTOR,
          useFactory: (opts: TranslatorOptions) => new TranslatorInterceptor(opts.translator),
          inject: [options.useFactory],
        },
      ],
      exports: [],
    };
  }
}

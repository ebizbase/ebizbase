import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HttpLoggerInterceptor } from './http-logger.interceptor';
import { HttpLoggerOptions } from './http-logger.options';

/**
 * The GrpcLoggerModule is a NestJS module that provides gRPC logging capabilities.
 * It ensures that only one instance of the module is created and used throughout the application.
 */
@Module({})
export class HttpLoggerModule {
  static forRoot(options: HttpLoggerOptions): DynamicModule {
    return {
      module: HttpLoggerModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: HttpLoggerInterceptor,
        },
        {
          provide: 'HTTP_LOGGER_OPTIONS',
          useValue: options,
        },
      ],
    };
  }

  /**
   * A singleton instance of the HttpLoggerModule.
   * This ensures that only one instance of the module is created and used throughout the application.
   */
  private static instance: HttpLoggerModule;

  /**
   * Constructs a new instance of the GrpcLoggerModule.
   *
   * @throws {Error} If an instance of GrpcLoggerModule has already been instantiated.
   * This ensures that the module is only imported in the root module.
   */
  constructor() {
    if (HttpLoggerModule.instance) {
      throw new Error(
        'HttpLoggerModule has already been instantiated. Please, import it only in the root module!'
      );
    }
    HttpLoggerModule.instance = this;
  }
}

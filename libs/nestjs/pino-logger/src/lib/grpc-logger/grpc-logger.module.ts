import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { GrpcLoggerInterceptor } from './grpc-logger.interceptor';
import { GrpcLoggerOptions } from './grpc-logger.options';

/**
 * The GrpcLoggerModule is a NestJS module that provides gRPC logging capabilities.
 * It ensures that only one instance of the module is created and used throughout the application.
 */
@Module({})
export class GrpcLoggerModule {
  /**
   * Configures the GrpcLoggerModule with the given options.
   *
   * @param options - Configuration options for the GrpcLogger.
   * @returns A DynamicModule configured with the provided options.
   */
  static forRoot(options: GrpcLoggerOptions): DynamicModule {
    return {
      module: GrpcLoggerModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: GrpcLoggerInterceptor,
        },
        {
          provide: 'GRPC_LOGGER_OPTIONS',
          useValue: options,
        },
      ],
    };
  }

  /**
   * A static instance of the GrpcLoggerModule.
   * This ensures that only one instance of the module is created and used throughout the application.
   */
  private static instance: GrpcLoggerModule;

  /**
   * Constructs a new instance of the GrpcLoggerModule.
   *
   * @throws {Error} If an instance of GrpcLoggerModule has already been instantiated.
   * This ensures that the module is only imported in the root module.
   */
  constructor() {
    if (GrpcLoggerModule.instance) {
      throw new Error(
        'GrpcLoggerModule has already been instantiated. Please, import it only in the root module!'
      );
    }
    GrpcLoggerModule.instance = this;
  }
}

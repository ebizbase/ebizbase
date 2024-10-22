import { Dict } from '@ebizbase/common-types';
import { GrpcLoggerModule } from '@ebizbase/nest-grpc-logger';
import { EliteLogger, EliteLoggerService } from '@ebizbase/nest-elite-logger';
import {
  DynamicModule,
  ForwardReference,
  INestMicroservice,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigSchema } from './schemas/schema.abstract';
import { ConfigService } from './services/config.service';

export type GrpcServiceOptions = Omit<GrpcOptions['options'], 'url'> & {
  defaultPort: number;
  logger: EliteLoggerService;
};

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class GrpcServiceBootstrapModule {
  private static readonly logger = new EliteLogger(GrpcServiceBootstrapModule.name);

  public static async create(
    mainModule: ClassConstructor<unknown>,
    schemas: ClassConstructor<ConfigSchema>[],
    options: GrpcServiceOptions
  ): Promise<{ microservice: INestMicroservice; port: number }> {
    const { defaultPort, logger, ...grpcOptions } = options;
    const port: number = parseInt(process.env['PORT'] || defaultPort.toString());
    const core = GrpcServiceBootstrapModule.launch(mainModule, schemas);
    const microservice = await NestFactory.createMicroservice<GrpcOptions>(core, {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${port}`,
        ...grpcOptions,
      },
      logger: logger,
    });
    microservice.enableShutdownHooks();
    await microservice.listen();
    return { microservice, port };
  }

  public static launch(
    mainModule: ClassConstructor<unknown>,
    schemas: ClassConstructor<ConfigSchema>[]
  ): DynamicModule {
    this.logger.debug('GrpcServiceBootstrapModule launching');
    const { providers, imports } = this.initialize(schemas);
    return {
      global: true,
      module: GrpcServiceBootstrapModule,
      imports: [
        // make sure GrpcLoggerModule is imported first to acurately execute time in log
        GrpcLoggerModule,
        ...imports,
        mainModule,
      ],
      providers: [...providers],
      exports: [ConfigService],
    };
  }

  private static initialize(schemas?: ClassConstructor<ConfigSchema>[]) {
    this.logger.trace('GrpcServiceBootstrapModule initializing');
    const configObject: Dict<string> = {};
    const providers: Array<Provider> = [];
    const imports: Array<DynamicModule | Type<unknown> | ForwardReference> = [];
    if (schemas) {
      for (const schema of schemas) {
        const instance = plainToInstance(schema, process.env, { enableImplicitConversion: true });
        const errors = validateSync(instance as object, {
          skipMissingProperties: false,
          stopAtFirstError: true,
        });
        if (errors.length > 0) {
          const details = errors.flatMap((error) => Object.values(error.constraints || {}));
          throw new Error(
            `Environment variable config has validation error: \n - ${details.join('\n - ')}\n`
          );
        }
        providers.push(...instance.providers());
        imports.push(...instance.imports());
        Object.assign(configObject, instance);
      }
    }
    providers.push({ provide: ConfigService, useValue: new ConfigService(configObject) });
    return { providers, imports };
  }
}

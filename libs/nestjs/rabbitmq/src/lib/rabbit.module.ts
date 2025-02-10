import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';

@Module({})
export class RabbitModule {
  static register(configs: Pick<RabbitMQConfig, 'channels' | 'exchanges'>): DynamicModule {
    if (!process.env['RABBITMQ_URIS']) {
      throw new Error('Missing MONGO_URI environment variable');
    }
    const uris = process.env['RABBITMQ_URIS'].split(',');
    const invalidUris = uris.filter((uri) => !/^amqp:\/\/.*:\d{1,5}$/.test(uri));
    if (invalidUris.length > 0) {
      throw new Error(`Invalid RabbitMQ URI(s): ${invalidUris.join(', ')}`);
    }
    return {
      global: true,
      module: RabbitModule,
      imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
          uri: uris,
          connectionInitOptions: { wait: true },
          enableControllerDiscovery: true,
          ...configs,
        }),
      ],
      exports: [RabbitMQModule, RabbitService],
      providers: [RabbitService],
    };
  }
}

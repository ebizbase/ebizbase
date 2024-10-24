import { Matches } from 'class-validator';

export class RabbitMQConfigSchema {
  @Matches(/^(?!\s*$).+$/, {
    message: 'RABBITMQ_URL is required.',
  })
  @Matches(/^amqp:\/\/\S+:\S+@\S+(:\d+)?(,\S+(:\d+)?)*\/\S+$/, {
    message:
      'RABBITMQ_URL must be a valid RabbitMQ connection URL. Example: "amqp://user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672".',
  })
  RABBITMQ_URL?: string;

  @Matches(/^(?!\s*$).+$/, {
    message: 'RABBITMQ_VIRTUAL_HOST is required.',
  })
  @Matches(/^\w+$/, {
    message:
      'RABBITMQ_VIRTUAL_HOST must be a valid virtual host string without starting with "/". Example: "my_vhost".',
  })
  RABBITMQ_VIRTUAL_HOST?: string;
}

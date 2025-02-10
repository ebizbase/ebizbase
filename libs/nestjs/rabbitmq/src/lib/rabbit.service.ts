import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async isConnectionUp(): Promise<boolean> {
    return this.amqpConnection.connected;
  }
}

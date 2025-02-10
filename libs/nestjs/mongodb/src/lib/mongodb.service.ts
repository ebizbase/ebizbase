import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async isConnectionUp(): Promise<boolean> {
    return this.connection.readyState === ConnectionStates.connected;
  }
}

import { DynamicModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, set } from 'mongoose';
import { MongoService } from './mongodb.service';

function setupConnectionLogging(connection: Connection, logger: Logger): void {
  connection.on('connected', () => logger.log('MongoDB connected'));
  connection.on('disconnected', () => logger.log('MongoDB disconnected'));
  if (process.env['NODE_ENV'] !== 'production') {
    set('debug', (collectionName, method, query, doc) => {
      logger.debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });
  }
}

@Module({})
export class MongoModule {
  static register(dbName: string): DynamicModule {
    const mongoUri = process.env['MONGODB_URI'];

    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI environment variable');
    }

    const isValidUri = /^(mongodb(?:\+srv)?):\/\/[^\s]+$/i.test(mongoUri);
    if (!isValidUri) {
      throw new Error('Invalid MONGODB_URI format');
    }

    const logger = new Logger('MongoDbModule');

    return {
      module: MongoModule,
      global: true,
      imports: [
        MongooseModule.forRoot(mongoUri, {
          dbName: dbName,
          onConnectionCreate: (connection) => setupConnectionLogging(connection, logger),
        }),
      ],
      providers: [MongoService],
      exports: [MongoService],
    };
  }
}

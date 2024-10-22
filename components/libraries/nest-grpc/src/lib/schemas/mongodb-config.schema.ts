import { Connection } from 'mongoose';
import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { ConfigSchema } from './schema.abstract';

export class MongoDBConfigSchema extends ConfigSchema {
  @Matches(/^(?!\s*$).+$/, {
    message: 'MONGODB_URL is required.',
  })
  @Matches(/^mongodb(\+srv)?:\/\/(\S+(:\S+)?@)?\S+(:\d+)?$/, {
    message:
      'MONGODB_URL must be a valid MongoDB connection URL starting with "mongodb://" or "mongodb+srv://" and should not contain database name and options. Example: "mongodb://user:password@localhost:27017" or "mongodb+srv://cluster.mongodb.net".',
  })
  @Matches(/^[^?]+$/, {
    message: ({ value }) =>
      `MONGODB_URL must not contain options. use MONGODB_OPTIONS instead. (Current: ${value})`,
  })
  @Matches(/^mongodb(\+srv)?:\/\/(\S+(:\S+)?@)?[^\/]+(:\d+)?$/, {
    message: ({ value }) =>
      `MONGODB_URL must not contain a database name. use MONGODB_DATABASE instead. (Current: ${value})`,
  })
  MONGODB_URL?: string;

  @Matches(/^(?!\s*$).+$/, {
    message: 'MONGODB_DATABASE is required.',
  })
  @IsString({ message: 'MONGODB_DATABASE is required.' })
  @Matches(/^(?!\/)/, {
    message: 'MONGODB_DATABASE must not start with a slash.',
  })
  @Matches(/^[^\s\/]+$/, {
    message: 'MONGODB_DATABASE must be a valid MongoDB database name.',
  })
  MONGODB_DATABASE!: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @Matches(/^[^?].+$/, {
    message: 'MONGODB_OPTIONS must not start with a question mark.',
  })
  @Matches(/^[a-zA-Z0-9=&]+$/, {
    message:
      'MONGODB_OPTIONS should be a valid connection option string. Example: "retryWrites=true&w=majority".',
  })
  MONGODB_OPTIONS?: string;

  private readonly logger = new EliteLogger(MongoDBConfigSchema.name);

  imports(): Array<DynamicModule | Type<unknown> | ForwardReference> {
    const uri = `${this.MONGODB_URL}/${this.MONGODB_DATABASE}${
      this.MONGODB_OPTIONS ? '?' + this.MONGODB_OPTIONS : ''
    }`;
    this.logger.trace(`Initializing MongooseModule import statement ${uri}`);
    return [
      MongooseModule.forRoot(uri, {
        connectionFactory: (connection: Connection) => {
          if (process.env.LOG_QUERY === 'true') {
            connection.set(
              'debug',
              async (collection: string, method: string, ...args: unknown[]) => {
                const safeStringify = (obj: any) =>
                  JSON.stringify(obj, (key, value) => (key == 'session' ? '[Session]' : value));
                const argsString = args
                  .map((arg) => (typeof arg === 'object' ? safeStringify(arg) : arg))
                  .join(', ');
                this.logger.info(`${collection}.${method}(${argsString})`);
              }
            );
          }
          return connection;
        },
      }),
    ];
  }
}

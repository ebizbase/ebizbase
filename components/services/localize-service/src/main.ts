import { GrpcServiceBootstrapModule, MongoDBConfigSchema } from '@ebizbase/nest-grpc';
import { EliteLoggerService } from '@ebizbase/nest-elite-logger';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const time = Date.now();
  const logger = new EliteLoggerService();
  logger.log('Starting localize microservice', 'Bootstrap');
  const { port } = await GrpcServiceBootstrapModule.create(AppModule, [MongoDBConfigSchema], {
    defaultPort: 3000,
    logger: logger,
    package: ['localize'],
    protoPath: [
      join(__dirname, './protos/common.proto'),
      join(__dirname, './protos/localize.proto'),
    ],
  });
  logger.log(`Localize service started in ${Date.now() - time}ms on port ${port}`, 'Bootstrap');
}

bootstrap();

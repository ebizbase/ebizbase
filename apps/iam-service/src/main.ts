import { PinoLogger } from '@ebizbase/nestjs-pino-logger';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MainModule } from './main.module';

async function bootstrap() {
  const logger = new PinoLogger();
  const domain = process.env['DOMAIN'];
  if (!domain) {
    throw new Error('Missing DOMAIN enviroment!');
  }
  const port = process.env['PORT'] || 3000;
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter(), {
    logger,
    cors: {
      origin: new RegExp(`^(https?://(?:.+.)?${domain})$`),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
    },
  });

  await app.register(fastifyCsrf);
  await app.register(helmet);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, '0.0.0.0');
  logger.log(`REST API PORT ${port}`, 'Bootstrap');
  logger.log('IAM service is up and running', 'Bootstrap');
}

bootstrap();

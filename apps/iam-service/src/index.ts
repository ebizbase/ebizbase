import { PinoLogger } from '@ebizbase/nestjs-pino-logger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MainModule } from './main.module';

async function bootstrap() {
  const bind = process.env['BIND'] || '0.0.0.0';
  const port = process.env['PORT'] || 3005;
  const logger = new PinoLogger();
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter(), {
    logger,
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    })
  );
  await app.listen(port, bind);
  logger.log(`REST API PORT ${bind}:${port}`, 'Bootstrap');
  logger.log('IAM service is up and running', 'Bootstrap');
}

bootstrap();

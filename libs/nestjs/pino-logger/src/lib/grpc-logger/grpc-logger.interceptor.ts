import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { PinoLogger } from '../pino-logger';
import { GrpcLoggerOptions } from './grpc-logger.options';

@Injectable()
export class GrpcLoggerInterceptor implements NestInterceptor {
  private logger = new PinoLogger(GrpcLoggerInterceptor.name);

  constructor(@Inject('GRPC_LOGGER_OPTIONS') private readonly options: GrpcLoggerOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const handler = context.getHandler().name;
    const rpcContext = context.switchToRpc();
    const metadata = rpcContext.getContext<Metadata>();

    // create new request id if it's not exists
    let requestId = metadata.get('request-id')[0] as string;
    if (!requestId) {
      requestId = uuid();
      metadata.add('request-id', requestId);
    }

    this.logger.info({ handler, metadata: metadata.getMap() }, 'gRPC Request');

    return next.handle().pipe(
      tap({
        next: () => {
          const executeTime = Date.now() - startTime;
          this.logger.info({ handler, metadata: metadata.getMap(), executeTime }, 'gRPC Response');
          if (
            this.options.slowWarningExecutionTime &&
            executeTime > this.options.slowWarningExecutionTime
          ) {
            this.logger.warn(
              { handler, metadata: metadata.getMap(), executeTime },
              'gRPC Response Slow'
            );
          }
        },
        error: (err) => {
          const executeTime = Date.now() - startTime;
          this.logger.error(
            { handler, metadata: metadata.getMap(), err, executeTime },
            'gRPC Error'
          );
          if (
            this.options.slowWarningExecutionTime &&
            executeTime > this.options.slowWarningExecutionTime
          ) {
            this.logger.warn(
              { handler, metadata: metadata.getMap(), err, executeTime },
              'gRPC Response Slow'
            );
          }
        },
      })
    );
  }
}

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { PinoLogger } from '../pino-logger';

import { HttpLoggerOptions } from './http-logger.options';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  private logger = new PinoLogger(HttpLoggerInterceptor.name);

  constructor(@Inject('HTTP_LOGGER_OPTIONS') private readonly options: HttpLoggerOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    // create new request id if it's not exists
    let requestId = request.headers['request-id'] as string;
    if (!requestId) {
      requestId = uuid();
      request.headers['request-id'] = requestId;
      response.setHeader('request-id', requestId);
    }

    this.logger.info(
      { method: request.method, url: request.url, headers: request.headers, body: request.body },
      'HTTP Request'
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const executeTime = Date.now() - startTime;
          this.logger.info(
            {
              method: request.method,
              url: request.url,
              statusCode: response.statusCode,
              executeTime,
            },
            'HTTP Response'
          );
          if (
            this.options.slowWarningExecutionTime &&
            executeTime > this.options.slowWarningExecutionTime
          ) {
            this.logger.warn(
              {
                method: request.method,
                url: request.url,
                statusCode: response.statusCode,
                executeTime,
              },
              'HTTP Response Slow'
            );
          }
        },
        error: (err) => {
          const executeTime = Date.now() - startTime;
          this.logger.error(
            {
              method: request.method,
              url: request.url,
              statusCode: response.statusCode,
              err,
              executeTime,
            },
            'HTTP Error'
          );
          if (
            this.options.slowWarningExecutionTime &&
            executeTime > this.options.slowWarningExecutionTime
          ) {
            this.logger.warn(
              {
                method: request.method,
                url: request.url,
                statusCode: response.statusCode,
                err,
                executeTime,
              },
              'HTTP Response Slow'
            );
          }
        },
      })
    );
  }
}

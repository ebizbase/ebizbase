/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, LoggerService } from '@nestjs/common';
import { PinoInstance } from './pino-instance';
import { LogLevel } from './types';

/**
 * EliteLoggerService is a custom logger service that implements the LoggerService interface from NestJS.
 * It provides various logging methods for different log levels such as verbose, debug, info, warn, error, and fatal.
 * The service uses Pino as the underlying logging library.
 *
 */
@Injectable()
export class EliteLoggerService implements LoggerService {
  /**
   * Logs a verbose message with optional parameters.
   * This method is intended for detailed tracing information.
   *
   * @param message - The primary message to log.
   * @param optionalParams - Additional parameters to include in the log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.TRACE, message, ...optionalParams);
  }

  /**
   * Logs a debug message with optional parameters.
   *
   * @param message - The primary message to log.
   * @param optionalParams - Additional optional parameters to log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.DEBUG, message, ...optionalParams);
  }

  /**
   * Logs a message with optional parameters at the 'info' level.
   *
   * @param message - The primary message to log.
   * @param optionalParams - Additional optional parameters to log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.INFO, message, ...optionalParams);
  }

  /**
   * Logs a warning message.
   *
   * @param message - The primary message to log.
   * @param optionalParams - Additional optional parameters to log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.WARN, message, ...optionalParams);
  }

  /**
   * Logs an error message with optional parameters.
   *
   * @param message - The error message to log.
   * @param optionalParams - Additional optional parameters to log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.ERROR, message, ...optionalParams);
  }

  /**
   * Logs a fatal error message.
   *
   * @param message - The message to log.
   * @param optionalParams - Additional optional parameters to log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    this.call(LogLevel.FATAL, message, ...optionalParams);
  }

  /**
   * Logs a message at the specified log level with optional parameters.
   *
   * @param level - The log level at which the message should be logged.
   * @param message - The message to log. Can be a string, object, or Error.
   * @param optionalParams - Additional parameters to log. If the last parameter is a string, it is treated as the context name.
   *
   * The method handles different types of messages:
   * - If the message is an object, it is merged into the log object.
   * - If the message is an Error, it is added to the log object under the 'err' key.
   * - If the message is a string and the log level and parameters indicate an incorrect exception handler contract,
   *   the message is converted to an Error and logged.
   * - Otherwise, the message and additional parameters are logged as provided.
   */
  protected call(level: LogLevel, message: any, ...optionalParams: any[]) {
    const objArg: Record<string, any> = {};

    // optionalParams contains extra params passed to logger
    // context name is the last item (this is convention in nestjs logger)
    let params: any[] = [];
    if (
      optionalParams.length !== 0 &&
      typeof optionalParams[optionalParams.length - 1] === 'string'
    ) {
      objArg['context'] = optionalParams[optionalParams.length - 1];
      params = optionalParams.slice(0, -1);
    }

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objArg['err'] = message;
      } else {
        Object.assign(objArg, message);
      }
      PinoInstance.getInstance().write(level, objArg, ...params);
    } else if (this.isWrongExceptionsHandlerContract(level, message, params)) {
      objArg['err'] = new Error(message);
      objArg['err'].stack = params[0];
      PinoInstance.getInstance().write(level, objArg);
    } else {
      PinoInstance.getInstance().write(level, objArg, message, ...params);
    }
  }

  /**
   * Unfortunately built-in (not only) `^.*Exception(s?)Handler$` classes call `.error`
   * method with not supported contract:
   *
   * - ExceptionsHandler
   * @param level
   * @param message
   * @param params
   * @see https://github.com/nestjs/nest/blob/35baf7a077bb972469097c5fea2f184b7babadfc/packages/core/exceptions/base-exception-filter.ts#L60-L63
   *
   * - ExceptionHandler
   * @see https://github.com/nestjs/nest/blob/99ee3fd99341bcddfa408d1604050a9571b19bc9/packages/core/errors/exception-handler.ts#L9
   *
   * - WsExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/websockets/exceptions/base-ws-exception-filter.ts#L47-L50
   *
   * - RpcExceptionsHandler @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/microservices/exceptions/base-rpc-exception-filter.ts#L26-L30
   *
   * - all of them
   * @see https://github.com/search?l=TypeScript&q=org%3Anestjs+logger+error+stack&type=Code
   */
  private isWrongExceptionsHandlerContract(
    level: LogLevel,
    message: any,
    params: any[]
  ): params is [string] {
    return (
      (level === LogLevel.ERROR || level === LogLevel.FATAL) &&
      typeof message === 'string' &&
      params.length === 1 &&
      typeof params[0] === 'string' &&
      /\n\s*at /.test(params[0])
    );
  }
}

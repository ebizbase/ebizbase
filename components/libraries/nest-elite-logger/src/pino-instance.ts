import { Optional } from '@ebizbase/common-types';
import pino from 'pino';
import { PinoPretty as pretty } from 'pino-pretty';
import { LogFormat, LoggerFn, LogLevel } from './types';

/**
 * This class provides a singleton logger using the Pino library.
 */
export class PinoInstance {
  private pinoLogger: pino.Logger;
  private static instance: PinoInstance;
  public readonly level: LogLevel;

  /**
   * @method getInstance
   * @description Returns the single instance of the Pino class.
   * @returns {PinoInstance} Instance of the Pino class.
   */
  public static getInstance(): PinoInstance {
    if (!PinoInstance.instance) {
      PinoInstance.instance = new PinoInstance();
    }
    return PinoInstance.instance;
  }

  /**
   * @constructor
   * @description Initializes a new instance of the Pino class. This method is private to ensure that only one instance is created.
   */
  private constructor() {
    const { format, level } = this.validateEnviromentVariable();
    this.level = level;
    this.pinoLogger = this.createLogger(format, level);
  }

  /**
   * Creates a pino logger instance with the specified format and log level.
   *
   * @param format - The format of the log output. Can be either `LogFormat.TEXT` or another format.
   * @param level - The log level for the logger. Determines the severity of logs to be captured.
   * @returns A configured pino logger instance.
   */
  private createLogger(format: LogFormat, level: LogLevel): pino.Logger {
    const options: pino.LoggerOptions = {
      level,
    };

    let stream = undefined;
    if (format === LogFormat.TEXT) {
      stream = pretty({
        sync: true,
        colorize: true,
        colorizeObjects: true,
        ignore: 'pid,hostname,context',
        messageFormat: '[{pid}] [{context}] {msg}',
      });
    }
    return pino(options, stream);
  }

  /**
   * Logs a message using the specified logging method.
   *
   * @param method - The logging method to use (e.g., 'info', 'error', etc.).
   * @param args - The arguments to log, which are parameters of the LoggerFn.
   */
  public write(method: LogLevel, ...args: Parameters<LoggerFn>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore args are union of tuple types
    this.pinoLogger[method](...args);
  }

  /**
   * Validates the environment variables related to logging configuration.
   *
   * This method checks the `LOG_FORMAT` and `LOG_LEVEL` environment variables to ensure they are set to valid values.
   * If any of the environment variables are invalid, it logs an error message and exits the process.
   *
   * @returns An object containing the validated `format` and `level` properties.
   *
   * @throws Will log an error and exit the process if the environment variables are invalid.
   *
   * @property {LogFormat} format - The logging format, either 'json' or 'text'.
   * @property {LogLevel} level - The logging level, one of 'trace', 'debug', 'info', 'warn', 'error', 'fatal', or 'silent'.
   */
  private validateEnviromentVariable(): {
    format: LogFormat;
    level: LogLevel;
  } {
    const errors: Array<string> = [];

    const format = process.env['LOG_FORMAT'] || 'json';
    if (!Object.values(LogFormat).includes(format as LogFormat)) {
      errors.push('LOG_FORMAT environment must be json, text');
    }

    const level = process.env['LOG_LEVEL'] || 'info';
    if (!Object.values(LogLevel).includes(level as LogLevel)) {
      errors.push('LOG_LEVEL environment must be trace, debug, info, warn, error, fatal or silent');
    }
    if (errors.length > 0) {
      // create error for getting stack trace
      const error = Error(`Logging environment invalid:\n - ${errors.join('\n - ')}`);
      // manually log error to console
      console.error(error);
      // exit process
      process.exit(1);
    }

    return {
      format: format as LogFormat,
      level: level as LogLevel,
    };
  }
}

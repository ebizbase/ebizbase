import pino from 'pino';
import { PinoInstance } from './pino-instance';
import { LoggerFn, LogLevel } from './types';

/**
 * Logger is a custom logger class that provides various logging methods for different log levels such as trace, debug, info, warn, error, and fatal.
 */
export class EliteLogger {
  public readonly level: LogLevel;

  constructor(private context?: string) {
    this.level = PinoInstance.getInstance().level;
  }

  /**
   * Log at trace level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(obj: unknown, msg?: string, ...args: any[]): void;
  trace(...args: Parameters<LoggerFn>) {
    this.call('trace', ...args);
  }

  /**
   * Log at debug level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(obj: unknown, msg?: string, ...args: any[]): void;
  debug(...args: Parameters<LoggerFn>) {
    this.call('debug', ...args);
  }

  /**
   * Log at info level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(obj: unknown, msg?: string, ...args: any[]): void;
  info(...args: Parameters<LoggerFn>) {
    this.call('info', ...args);
  }

  /**
   * Log at warn level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(obj: unknown, msg?: string, ...args: any[]): void;
  warn(...args: Parameters<LoggerFn>) {
    this.call('warn', ...args);
  }

  /**
   * Log at error level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(obj: unknown, msg?: string, ...args: any[]): void;
  error(...args: Parameters<LoggerFn>) {
    this.call('error', ...args);
  }

  /**
   * Log at fatal level.
   * @param msg The log message.
   * @param args Additional parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal(msg: string, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal(obj: unknown, msg?: string, ...args: any[]): void;
  fatal(...args: Parameters<LoggerFn>) {
    this.call('fatal', ...args);
  }

  /**
   * Set the context for the logger.
   * @param value The context value.
   */
  setContext(value: string) {
    this.context = value;
  }

  /**
   * Call the Pino log method with the given level and parameters.
   * @param level The log level.
   * @param args The log parameters.
   */
  protected call(level: pino.Level, ...args: Parameters<LoggerFn>) {
    if (typeof args[0] === 'object') {
      const firstArg = args[0];
      if (firstArg instanceof Error) {
        args = [
          Object.assign({ ['context']: this.context }, { ['err']: firstArg }) as object,
          ...args.slice(1),
        ] as [object, string?, ...unknown[]];
      } else {
        args = [
          Object.assign({ ['context']: this.context }, firstArg) as object,
          ...args.slice(1),
        ] as [object, string?, ...unknown[]];
      }
    } else {
      args = [{ ['context']: this.context }, ...args] as Parameters<LoggerFn>;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore args are union of tuple types
    PinoInstance.getInstance().write(level, ...args);
  }
}

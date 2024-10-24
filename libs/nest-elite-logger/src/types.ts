export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  SILENT = 'silent',
}
export enum LogFormat {
  JSON = 'json',
  TEXT = 'text',
}

export type LoggerFn =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((msg: string, ...args: any[]) => void)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((obj: object, msg?: string, ...args: any[]) => void);

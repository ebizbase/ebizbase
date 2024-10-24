import { Level } from 'pino';
import { Transform } from 'stream';
import { PinoInstance } from './pino-instance';
import { LogFormat, LogLevel } from './types';

const anythingOrUndefined = () => ({
  asymmetricMatch: (actual: any) => actual === undefined || actual !== null,
  toString: () => 'anythingOrUndefined',
});

jest.mock('pino', () => ({
  ...jest.requireActual('pino'),
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  })),
}));

describe('PinoInstance', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    jest.setTimeout(2000);
    originalEnv = { ...process.env }; // save original environment variables
  });

  afterEach(() => {
    (PinoInstance as any).instance = null; // reset instance of Pino
    process.env = { ...originalEnv }; // reset environment variables
    jest.clearAllMocks(); // clear all mocks
  });

  it('should implement singleton pattern', () => {
    const pino = require('pino');

    const instance1 = PinoInstance.getInstance();
    const instance2 = PinoInstance.getInstance();
    PinoInstance.getInstance();

    expect(instance1).toBe(instance2);
    expect(pino.default).toHaveBeenCalledTimes(1);
  });

  describe('should initialize', () => {
    it('should initialize with default values', () => {
      delete process.env['LOG_FORMAT'];
      delete process.env['LOG_LEVEL'];
      const pino = require('pino');
      const instance = PinoInstance.getInstance();
      expect(pino.default).toHaveBeenCalledWith({ level: 'info' }, undefined);
    });

    describe('with format', () => {
      it.each(Object.values(LogFormat).map((v) => [v]))(
        'should initialize with format %s',
        (format) => {
          process.env['LOG_FORMAT'] = format;
          const pino = require('pino');
          const instance = PinoInstance.getInstance();

          expect(instance).toBeInstanceOf(PinoInstance);
          switch (format) {
            case LogFormat.JSON:
              expect(pino.default).toHaveBeenCalledWith(expect.anything(), undefined);
              break;
            default:
              expect(pino.default).toHaveBeenCalledWith(expect.anything(), expect.any(Transform));
              break;
          }
        }
      );
    });

    describe('with level', () => {
      it.each(Object.values(LogLevel).map((v) => [v]))(
        'should initialize with log level %s',
        (level) => {
          process.env['LOG_LEVEL'] = level;
          const pino = require('pino');
          const instance = PinoInstance.getInstance();

          expect(instance).toBeInstanceOf(PinoInstance);
          expect(pino.default).toHaveBeenCalled();
          expect(pino.default).toHaveBeenCalledWith({ level: level }, anythingOrUndefined());
        }
      );
    });
  });

  describe.each([
    [[['LOG_FORMAT', 'invalid-format']], ['LOG_FORMAT environment must be json, text']],
    [
      [['LOG_LEVEL', 'invalid-level']],
      ['LOG_LEVEL environment must be trace, debug, info, warn, error, fatal or silent'],
    ],
    [
      [
        ['LOG_FORMAT', 'invalid-format'],
        ['LOG_LEVEL', 'invalid-level'],
      ],
      [
        'LOG_FORMAT environment must be json, text',
        'LOG_LEVEL environment must be trace, debug, info, warn, error, fatal or silent',
      ],
    ],
  ])('should handle invalid environment variables', (environments, expectedErrors) => {
    let consoleErrorSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;

    beforeAll(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockReturnThis();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    const envVars = environments.map(([envVar]) => envVar).join(', ');
    it(`should log error when ${
      environments.length === 1 ? 'only' : `both`
    } environment variable ${envVars} is invalid and terminate the application with exit code 1`, () => {
      for (const [envVar, value] of environments) {
        process.env[envVar] = value;
      }
      PinoInstance.getInstance();

      expect((consoleErrorSpy.mock.calls[0][0] as Error).message).toBe(
        'Logging environment invalid:\n - ' + expectedErrors.join('\n - ')
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('logging', () => {
    it.each([
      ['info', 'test message'],
      ['trace', 'trace message'],
      ['debug', 'debug message'],
      ['warn', 'warn message'],
      ['error', 'error message'],
      ['fatal', 'fatal message'],
    ])('should log %s with message: %s', (level, message) => {
      const instance = PinoInstance.getInstance();
      const logSpy = jest.spyOn(instance['pinoLogger'], level as Level);
      instance.write(level as LogLevel, message);
      expect(logSpy).toHaveBeenCalledWith(message);
    });

    it.each([
      ['info', 'test message', { description: 'test description' }],
      ['trace', 'trace message', { description: 'trace description' }],
      ['debug', 'debug message', { description: 'debug description' }],
      ['warn', 'warn message', { description: 'warn description' }],
      ['error', 'error message', { description: 'error description' }],
      ['fatal', 'fatal message', { description: 'fatal description' }],
    ])('should log %s with message: %s and description: %j', (level, message, description) => {
      const instance = PinoInstance.getInstance();
      const logSpy = jest.spyOn(instance['pinoLogger'], level as Level);
      instance.write(level as LogLevel, description, message);
      expect(logSpy).toHaveBeenCalledWith(description, message);
    });
  });
});

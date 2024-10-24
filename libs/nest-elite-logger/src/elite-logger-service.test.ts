import { EliteLoggerService } from './elite-logger-service';
import { PinoInstance } from './pino-instance';

jest.mock('./pino-instance');

describe('EliteLoggerService', () => {
  let loggerService: EliteLoggerService;
  let pinoInstance: jest.Mocked<PinoInstance>;

  beforeEach(() => {
    loggerService = new EliteLoggerService();
    pinoInstance = {
      write: jest.fn(),
    } as unknown as jest.Mocked<PinoInstance>;
    (PinoInstance.getInstance as jest.Mock).mockReturnValue(pinoInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should call correct pino method', () => {
    it.each([
      ['verbose', 'trace'],
      ['debug', 'debug'],
      ['log', 'info'],
      ['warn', 'warn'],
      ['error', 'error'],
      ['fatal', 'fatal'],
    ])('should call %s level for %s method', (method, level) => {
      const message = `${level} message`;
      const context = 'test-context';
      (loggerService as any)[method](message, context);
      expect(pinoInstance.write).toHaveBeenCalledWith(level, { context }, message);
    });
  });

  it('should handle object message correctly', () => {
    const message = { key: 'value' };
    const context = 'test-context';
    (loggerService as any)['debug'](message, context);
    expect(pinoInstance.write).toHaveBeenCalledWith('debug', { context, ...message });
  });

  it('should handle optional params correctly', () => {
    const context = 'test-context';
    const message = 'User %s performed action %s';
    loggerService.debug(message, 'john_doe', 'login', context);
    expect(pinoInstance.write).toHaveBeenCalledWith(
      'debug',
      { context },
      message,
      'john_doe',
      'login'
    );
  });

  it('should handle Error object message correctly', () => {
    const error = new Error('test error');
    const context = 'test-context';
    loggerService.error(error, context);
    expect(pinoInstance.write).toHaveBeenCalledWith('error', { context, err: error });
  });

  it('should handle wrong exceptions handler contract correctly', () => {
    const error = new Error('test error');
    const context = 'test-context';
    loggerService.error(error.message, error.stack, context);
    expect(pinoInstance.write).toHaveBeenCalledWith('error', { context, err: error });
  });
});

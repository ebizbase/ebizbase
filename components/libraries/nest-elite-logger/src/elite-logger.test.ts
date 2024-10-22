import { EliteLogger } from './elite-logger';
import { PinoInstance } from './pino-instance';

jest.mock('./pino-instance');

describe('EliteLogger', () => {
  let logger: EliteLogger;
  let pinoInstance: jest.Mocked<PinoInstance>;

  beforeEach(() => {
    pinoInstance = {
      level: 'info',
      write: jest.fn(),
    } as unknown as jest.Mocked<PinoInstance>;
    (PinoInstance.getInstance as jest.Mock).mockReturnValue(pinoInstance);
    logger = new EliteLogger('test-context');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])(
    'should log %s messages',
    (level) => {
      const message = `${level} message`;
      (logger as any)[level](message);
      expect(pinoInstance.write).toHaveBeenCalledWith(level, { context: 'test-context' }, message);
    }
  );

  it('should log messages with objects', () => {
    const obj = { key: 'value' };
    logger.info(obj, 'info message');
    expect(pinoInstance.write).toHaveBeenCalledWith(
      'info',
      { context: 'test-context', key: 'value' },
      'info message'
    );
  });

  it('should log messages with errors', () => {
    const error = new Error('test error');
    logger.error(error, 'error message');
    expect(pinoInstance.write).toHaveBeenCalledWith(
      'error',
      { context: 'test-context', err: error },
      'error message'
    );
  });

  it('should set context', () => {
    logger.setContext('new-context');
    logger.info('info message');
    expect(pinoInstance.write).toHaveBeenCalledWith(
      'info',
      { context: 'new-context' },
      'info message'
    );
  });
});

import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { PinoLogger } from '../pino-logger';

import { GrpcLoggerInterceptor } from './grpc-logger.interceptor';
import { GrpcLoggerOptions } from './grpc-logger.options';

jest.mock('../pino-logger');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'test-uuid') }));

describe('GrpcLoggerInterceptor', () => {
  let interceptor: GrpcLoggerInterceptor;
  let logger: jest.Mocked<PinoLogger>;

  const mockOptions: GrpcLoggerOptions = {
    slowWarningExecutionTime: 100, // Thay đổi giá trị theo yêu cầu
  };

  const createMockExecutionContext = (requestId?: string) => {
    const mockMetadata = new Metadata();
    if (requestId) {
      mockMetadata.add('request-id', requestId);
    }

    return {
      switchToRpc: () => ({
        getContext: () => mockMetadata,
      }),
      getHandler: () => ({
        name: 'testHandler',
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    logger = new PinoLogger('GrpcLoggerInterceptor') as jest.Mocked<PinoLogger>;
    interceptor = new GrpcLoggerInterceptor(mockOptions);
    interceptor['logger'] = logger; // Gán logger mock cho interceptor
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log gRPC request and response', (done) => {
    const mockContext = createMockExecutionContext();
    const mockNext: CallHandler = {
      handle: () => of({ response: 'success' }),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(logger.info).toHaveBeenCalledWith(
        { handler: 'testHandler', metadata: expect.any(Object) },
        'gRPC Request'
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          handler: 'testHandler',
          metadata: expect.any(Object),
          executeTime: expect.any(Number),
        },
        'gRPC Response'
      );
      done();
    });
  });

  it('should log error on gRPC call failure', (done) => {
    const mockContext = createMockExecutionContext();
    const mockError = new Error('test error');
    const mockNext: CallHandler = {
      handle: () => throwError(() => mockError),
    };

    interceptor.intercept(mockContext, mockNext).subscribe({
      error: () => {
        expect(logger.info).toHaveBeenCalledWith(
          { handler: 'testHandler', metadata: expect.any(Object) },
          'gRPC Request'
        );
        expect(logger.error).toHaveBeenCalledWith(
          {
            handler: 'testHandler',
            metadata: expect.any(Object),
            err: mockError,
            executeTime: expect.any(Number),
          },
          'gRPC Error'
        );
        done();
      },
    });
  });

  it('should add request-id if not provided', (done) => {
    const mockContext = createMockExecutionContext(); // Không có request-id
    const mockNext: CallHandler = {
      handle: () => of({ response: 'success' }),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          handler: 'testHandler',
          metadata: expect.objectContaining({ 'request-id': 'test-uuid' }),
        }),
        'gRPC Request'
      );
      done();
    });
  });

  it('should log a warning if execution time exceeds slowWarningExecutionTime', (done) => {
    const mockContext = createMockExecutionContext();
    const mockNext: CallHandler = {
      handle: () => of({ response: 'success' }),
    };

    const originalDateNow = Date.now;
    Date.now = jest
      .fn()
      .mockReturnValueOnce(0) // Start time
      .mockReturnValueOnce(200); // End time, making execution time 200ms

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(logger.info).toHaveBeenCalledWith(
        { handler: 'testHandler', metadata: expect.any(Object) },
        'gRPC Request'
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          handler: 'testHandler',
          metadata: expect.any(Object),
          executeTime: 200,
        },
        'gRPC Response'
      );
      expect(logger.warn).toHaveBeenCalledWith(
        {
          handler: 'testHandler',
          metadata: expect.any(Object),
          executeTime: 200,
        },
        'gRPC Response Slow'
      );
      Date.now = originalDateNow; // Restore original Date.now
      done();
    });
  });

  it('should log a warning if execution time exceeds slowWarningExecutionTime on error', (done) => {
    const mockContext = createMockExecutionContext();
    const mockError = new Error('test error');
    const mockNext: CallHandler = {
      handle: () => throwError(() => mockError),
    };

    const originalDateNow = Date.now;
    Date.now = jest
      .fn()
      .mockReturnValueOnce(0) // Start time
      .mockReturnValueOnce(200); // End time, making execution time 200ms

    interceptor.intercept(mockContext, mockNext).subscribe({
      error: () => {
        expect(logger.info).toHaveBeenCalledWith(
          { handler: 'testHandler', metadata: expect.any(Object) },
          'gRPC Request'
        );
        expect(logger.error).toHaveBeenCalledWith(
          {
            handler: 'testHandler',
            metadata: expect.any(Object),
            err: mockError,
            executeTime: 200,
          },
          'gRPC Error'
        );
        expect(logger.warn).toHaveBeenCalledWith(
          {
            handler: 'testHandler',
            metadata: expect.any(Object),
            err: mockError,
            executeTime: 200,
          },
          'gRPC Response Slow'
        );
        Date.now = originalDateNow; // Restore original Date.now
        done();
      },
    });
  });
});

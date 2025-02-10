import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { of, throwError } from 'rxjs';

import { PinoLogger } from '../pino-logger';

import { HttpLoggerInterceptor } from './http-logger.interceptor';
import { HttpLoggerOptions } from './http-logger.options';

jest.mock('../pino-logger');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'test-uuid') }));

describe('HttpLoggerInterceptor', () => {
  let interceptor: HttpLoggerInterceptor;
  let logger: jest.Mocked<PinoLogger>;

  const mockOptions: HttpLoggerOptions = {
    slowWarningExecutionTime: 100, // Thay đổi giá trị theo yêu cầu
  };

  const createMockExecutionContext = (request: Partial<Request>, response: Partial<Response>) => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    logger = new PinoLogger('HttpLoggerInterceptor') as jest.Mocked<PinoLogger>;
    interceptor = new HttpLoggerInterceptor(mockOptions);
    interceptor['logger'] = logger; // Gán logger mock cho interceptor
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log HTTP request and response', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
      body: {},
    } as Partial<Request>;
    const mockResponse = {
      statusCode: 200,
      setHeader: jest.fn(),
    } as Partial<Response>;
    const mockContext = createMockExecutionContext(mockRequest, mockResponse);
    const mockNext: CallHandler = {
      handle: () => of({ response: 'success' }),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(logger.info).toHaveBeenCalledWith(
        { method: 'GET', url: '/test', headers: { 'request-id': 'test-uuid' }, body: {} },
        'HTTP Request'
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/test',
          statusCode: 200,
          executeTime: expect.any(Number),
        },
        'HTTP Response'
      );
      done();
    });
  });

  it('should log error on HTTP call failure', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
      body: {},
    } as Partial<Request>;
    const mockResponse = {
      statusCode: 500,
      setHeader: jest.fn(),
    } as Partial<Response>;
    const mockContext = createMockExecutionContext(mockRequest, mockResponse);
    const mockError = new Error('test error');
    const mockNext: CallHandler = {
      handle: () => throwError(() => mockError),
    };

    interceptor.intercept(mockContext, mockNext).subscribe({
      error: () => {
        expect(logger.info).toHaveBeenCalledWith(
          { method: 'GET', url: '/test', headers: { 'request-id': 'test-uuid' }, body: {} },
          'HTTP Request'
        );
        expect(logger.error).toHaveBeenCalledWith(
          {
            method: 'GET',
            url: '/test',
            statusCode: 500,
            err: mockError,
            executeTime: expect.any(Number),
          },
          'HTTP Error'
        );
        done();
      },
    });
  });

  it('should add request-id if not provided', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
      body: {},
    } as Partial<Request>;
    const mockResponse = {
      statusCode: 200,
      setHeader: jest.fn(),
    } as Partial<Response>;
    const mockContext = createMockExecutionContext(mockRequest, mockResponse);
    const mockNext: CallHandler = {
      handle: () => of({ response: 'success' }),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(mockRequest.headers && mockRequest.headers['request-id']).toBe('test-uuid');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('request-id', 'test-uuid');
      done();
    });
  });

  it('should log a warning if execution time exceeds slowWarningExecutionTime', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
      body: {},
    } as Partial<Request>;
    const mockResponse = {
      statusCode: 200,
      setHeader: jest.fn(),
    } as Partial<Response>;
    const mockContext = createMockExecutionContext(mockRequest, mockResponse);
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
        { method: 'GET', url: '/test', headers: { 'request-id': 'test-uuid' }, body: {} },
        'HTTP Request'
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/test',
          statusCode: 200,
          executeTime: 200,
        },
        'HTTP Response'
      );
      expect(logger.warn).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/test',
          statusCode: 200,
          executeTime: 200,
        },
        'HTTP Response Slow'
      );
      Date.now = originalDateNow; // Restore original Date.now
      done();
    });
  });

  it('should log a warning if execution time exceeds slowWarningExecutionTime on error', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
      body: {},
    } as Partial<Request>;
    const mockResponse = {
      statusCode: 500,
      setHeader: jest.fn(),
    } as Partial<Response>;
    const mockContext = createMockExecutionContext(mockRequest, mockResponse);
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
          { method: 'GET', url: '/test', headers: { 'request-id': 'test-uuid' }, body: {} },
          'HTTP Request'
        );
        expect(logger.error).toHaveBeenCalledWith(
          {
            method: 'GET',
            url: '/test',
            statusCode: 500,
            err: mockError,
            executeTime: 200,
          },
          'HTTP Error'
        );
        expect(logger.warn).toHaveBeenCalledWith(
          {
            method: 'GET',
            url: '/test',
            statusCode: 500,
            err: mockError,
            executeTime: 200,
          },
          'HTTP Response Slow'
        );
        Date.now = originalDateNow; // Restore original Date.now
        done();
      },
    });
  });
});

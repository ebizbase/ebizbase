import { EmptyObject } from '@ebizbase/common-types';
import { GrpcClientTesting, GrpcServerTesting } from '@ebizbase/nest-grpc-testing';
import { Metadata, status } from '@grpc/grpc-js';
import { ClientGrpcProxy, GrpcMethod } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom, Observable } from 'rxjs';
import {
  GrpcAbortedException,
  GrpcDataLossException,
  GrpcException,
  GrpcFailedPreconditionException,
  GrpcInternalException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcOutOfRangeException,
  GrpcPermissionDeniedException,
  GrpcResourceExhaustedException,
  GrpcUnauthenticatedException,
  GrpcUnavailableException,
  GrpcUnimplementedException,
  GrpcUnknownException,
} from './grpc-exception';
import { Controller } from '@nestjs/common';
import { tmpdir } from 'os';
import { stat, write, writeFileSync } from 'fs';

const proto = `syntax = "proto3";
package test;
service ExceptionTestService {
  rpc GetException(StatusCode) returns (Empty);
}
message StatusCode {
  int32 code = 1;
}
message Empty {}
`;

interface StatusCode {
  code?: number;
}

interface ExceptionTestService {
  getException(data: StatusCode, metadata?: Metadata, ...rest: any[]): Observable<EmptyObject>;
}

@Controller()
class ExceptionTestController implements ExceptionTestService {
  @GrpcMethod('ExceptionTestService')
  getException({ code }: StatusCode): Observable<EmptyObject> {
    const metadata = new Metadata();
    metadata.add('test-key', 'test-value');
    switch (code) {
      case status.UNKNOWN:
        throw new GrpcUnknownException('Unknow error message.', metadata);
      case status.INVALID_ARGUMENT:
        throw new GrpcInvalidArgumentException('Invalid argument error message.', metadata);
      case status.NOT_FOUND:
        throw new GrpcNotFoundException('Not found error message.', metadata);
      case status.PERMISSION_DENIED:
        throw new GrpcPermissionDeniedException('Permission denied error message.', metadata);
      case status.UNAUTHENTICATED:
        throw new GrpcUnauthenticatedException('Unauthenticated error message.', metadata);
      case status.RESOURCE_EXHAUSTED:
        throw new GrpcResourceExhaustedException('Resource exhausted error message.', metadata);
      case status.FAILED_PRECONDITION:
        throw new GrpcFailedPreconditionException('Failed precondition error message.', metadata);
      case status.ABORTED:
        throw new GrpcAbortedException('Aborted error message.', metadata);
      case status.OUT_OF_RANGE:
        throw new GrpcOutOfRangeException('Out of range error message.', metadata);
      case status.UNIMPLEMENTED:
        throw new GrpcUnimplementedException('Unimplemented error message.', metadata);
      case status.INTERNAL:
        throw new GrpcInternalException('Internal error message.', metadata);
      case status.UNAVAILABLE:
        throw new GrpcUnavailableException('Unavailable error message.', metadata);
      case status.DATA_LOSS:
        throw new GrpcDataLossException('Data loss error message.', metadata);
      default:
        throw new GrpcException('General error message.', status.ALREADY_EXISTS, {
          'test-key': 'test-value',
        });
    }
  }
}

describe('GrpcException', () => {
  const SERVER_START_TIMEOUT = 10000;
  let grpcServer: GrpcServerTesting;
  let activeLanguageServiceProxy: ClientGrpcProxy;
  let activeLanguageService: ExceptionTestService;

  beforeAll(async () => {
    const protoFile = join(tmpdir(), 'grpc-exception.proto');
    writeFileSync(protoFile, proto);
    grpcServer = await GrpcServerTesting.createGrpcServer(
      {
        controllers: [ExceptionTestController],
      },
      {
        packageName: `test`,
        protoFile,
        timeout: SERVER_START_TIMEOUT,
      }
    );
    activeLanguageServiceProxy = await GrpcClientTesting.createGrpcClient(grpcServer.options);
    activeLanguageService =
      activeLanguageServiceProxy.getService<ExceptionTestService>('ExceptionTestService');
  }, SERVER_START_TIMEOUT);

  afterAll(async () => {
    activeLanguageServiceProxy.close();
    await grpcServer.stop();
  });

  const testCases = [
    {
      code: undefined,
      expectedCode: status.ALREADY_EXISTS,
      expectedMessage: 'General error message.',
    },
    {
      code: status.UNKNOWN,
      expectedCode: status.UNKNOWN,
      expectedMessage: 'Unknow error message.',
    },
    {
      code: status.INVALID_ARGUMENT,
      expectedCode: status.INVALID_ARGUMENT,
      expectedMessage: 'Invalid argument error message.',
    },
    {
      code: status.NOT_FOUND,
      expectedCode: status.NOT_FOUND,
      expectedMessage: 'Not found error message.',
    },
    {
      code: status.PERMISSION_DENIED,
      expectedCode: status.PERMISSION_DENIED,
      expectedMessage: 'Permission denied error message.',
    },
    {
      code: status.UNAUTHENTICATED,
      expectedCode: status.UNAUTHENTICATED,
      expectedMessage: 'Unauthenticated error message.',
    },
    {
      code: status.RESOURCE_EXHAUSTED,
      expectedCode: status.RESOURCE_EXHAUSTED,
      expectedMessage: 'Resource exhausted error message.',
    },
    {
      code: status.FAILED_PRECONDITION,
      expectedCode: status.FAILED_PRECONDITION,
      expectedMessage: 'Failed precondition error message.',
    },
    {
      code: status.ABORTED,
      expectedCode: status.ABORTED,
      expectedMessage: 'Aborted error message.',
    },
    {
      code: status.OUT_OF_RANGE,
      expectedCode: status.OUT_OF_RANGE,
      expectedMessage: 'Out of range error message.',
    },
    {
      code: status.UNIMPLEMENTED,
      expectedCode: status.UNIMPLEMENTED,
      expectedMessage: 'Unimplemented error message.',
    },
    {
      code: status.INTERNAL,
      expectedCode: status.INTERNAL,
      expectedMessage: 'Internal error message.',
    },
    {
      code: status.UNAVAILABLE,
      expectedCode: status.UNAVAILABLE,
      expectedMessage: 'Unavailable error message.',
    },
    {
      code: status.DATA_LOSS,
      expectedCode: status.DATA_LOSS,
      expectedMessage: 'Data loss error message.',
    },
  ];
  it.each(testCases)(
    'should bypass all information grpc status code $code',
    async ({ code, expectedCode, expectedMessage }) => {
      try {
        await firstValueFrom(activeLanguageService.getException({ code }));
        fail('Should throw an error');
      } catch (error) {
        expect(error.code).toBe(expectedCode);
        expect(error.details).toBe(expectedMessage);
        expect(error.metadata.get('test-key')[0]).toBe('test-value');
      }
    }
  );
});

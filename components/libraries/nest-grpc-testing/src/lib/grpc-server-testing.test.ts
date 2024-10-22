import { INestMicroservice, INestApplication } from '@nestjs/common';
import { GrpcServerTesting } from './grpc-server-testing';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';

describe('GrpcServerTesting', () => {
  let grpcServer: GrpcServerTesting;
  let mockApp: INestApplication;
  let mockMicroservice: INestMicroservice;

  beforeEach(async () => {
    mockApp = {
      connectMicroservice: jest.fn().mockReturnValue({}),
      startAllMicroservices: jest.fn(),
      init: jest.fn(),
      close: jest.fn(),
    } as unknown as INestApplication;

    mockMicroservice = {
      close: jest.fn(),
    } as unknown as INestMicroservice;

    // Create a temporary .proto file
    const protoFilePath = join(tmpdir(), 'testing.proto');
    writeFileSync(
      protoFilePath,
      `
       syntax = "proto3";
       package testpackage;
       service TestService {
         rpc TestMethod (TestRequest) returns (TestResponse);
       }
       message TestRequest {
         string name = 1;
       }
       message TestResponse {
         string message = 1;
       }
     `
    );

    grpcServer = await GrpcServerTesting.createGrpcServer(
      { module: class TestModule {} },
      { protoFile: protoFilePath, packageName: 'testpackage' }
    );
    grpcServer['application'] = mockApp;
    grpcServer['microservice'] = mockMicroservice;
  });

  it('should start the gRPC server successfully', async () => {
    expect(grpcServer).toBeDefined();
    expect(grpcServer.options.url.startsWith('127.0.0.1')).toBeTruthy();
  });

  it('should stop the gRPC server successfully', async () => {
    await grpcServer.stop();
    expect(mockMicroservice.close).toHaveBeenCalled();
    expect(mockApp.close).toHaveBeenCalled();
  });
});

import { ClientGrpcProxy } from '@nestjs/microservices';
import { GrpcClientTesting } from './grpc-client-testing';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('GrpcClientTesting', () => {
  let grpcClient: ClientGrpcProxy;
  let protoFilePath: string;

  const grpcOptions = {
    url: 'localhost:5000',
    package: 'testpackage',
    protoPath: '', // This will be set dynamically
  };

  beforeAll(async () => {
    // Create a temporary .proto file
    const tmpDir = os.tmpdir();
    protoFilePath = path.join(tmpDir, 'test.proto');
    fs.writeFileSync(
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

    grpcOptions.protoPath = protoFilePath;
    grpcClient = await GrpcClientTesting.createGrpcClient(grpcOptions);
  });

  afterAll(() => {
    // Clean up the temporary .proto file
    if (fs.existsSync(protoFilePath)) {
      fs.unlinkSync(protoFilePath);
    }
  });

  it('should create a gRPC client proxy', () => {
    expect(grpcClient).toBeDefined();
  });

  it('should have the correct gRPC options', () => {
    const clientOptions = (grpcClient as any).options;
    expect(clientOptions.url).toBe(grpcOptions.url);
    expect(clientOptions.package).toBe(grpcOptions.package);
    expect(clientOptions.protoPath).toBe(grpcOptions.protoPath);
  });
});

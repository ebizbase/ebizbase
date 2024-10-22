import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { GrpcServiceBootstrapModule, GrpcServiceOptions } from './grpc-service-bootstrap.module';
import { ConfigService } from './services/config.service';
import { ConfigSchema } from './schemas/schema.abstract';
import { EliteLoggerService } from '@ebizbase/nest-elite-logger';
import { DynamicModule } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { MongoDBConfigSchema } from './schemas/mongodb-config.schema';

describe('GrpcServiceBootstrapModule', () => {
  let module: TestingModule;
  let protoFilePath: string;

  beforeEach(async () => {
    // Create a temporary .proto file
    protoFilePath = join(tmpdir(), 'testing.proto');
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

    module = await Test.createTestingModule({
      imports: [GrpcServiceBootstrapModule],
    }).compile();
  });

  describe('create', () => {
    it('should create a microservice and return it with the port', async () => {
      const mainModule = class {};
      const schemas: ClassConstructor<ConfigSchema>[] = [];
      const options: GrpcServiceOptions = {
        defaultPort: 5000,
        logger: new EliteLoggerService(),
        package: 'testpackage',
        protoPath: protoFilePath,
      };

      const result = await GrpcServiceBootstrapModule.create(mainModule, schemas, options);

      expect(result).toHaveProperty('microservice');
      expect(result).toHaveProperty('port', 5000);
    });

    it('should throw error when enviroment variable is invalid for schema', async () => {
      const mainModule = class {};
      const schemas: ClassConstructor<ConfigSchema>[] = [MongoDBConfigSchema];
      const options: GrpcServiceOptions = {
        defaultPort: 5000,
        logger: new EliteLoggerService(),
        package: 'testpackage',
        protoPath: protoFilePath,
      };
      await expect(
        GrpcServiceBootstrapModule.create(mainModule, schemas, options)
      ).rejects.toThrow();
    });
  });
});

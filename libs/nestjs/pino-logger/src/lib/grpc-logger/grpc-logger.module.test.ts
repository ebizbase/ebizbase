import { Test, TestingModule } from '@nestjs/testing';

import { GrpcLoggerModule } from './grpc-logger.module';

describe('GrpcLoggerModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [GrpcLoggerModule.forRoot({ slowWarningExecutionTime: 10 })],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should throw an error if instantiated more than once', () => {
    const createNewModuleInstance = () => {
      return new GrpcLoggerModule(); // Cố gắng tạo instance mới
    };

    // Kiểm tra xem lỗi có được ném ra không
    expect(createNewModuleInstance).toThrowError(
      'GrpcLoggerModule has already been instantiated. Please, import it only in the root module!'
    );
  });
});

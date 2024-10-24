import 'reflect-metadata';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcController } from './grpc-controller.decorator';

jest.mock('@nestjs/common', () => ({
  Controller: jest.fn(() => Controller),
}));

jest.mock('@nestjs/microservices', () => ({
  GrpcMethod: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('GrpcController Decorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should apply the Controller decorator to the target class', () => {
    @GrpcController()
    class TestController {
      methodOne() {}
      methodTwo() {}
      methodThree() {}
    }
    expect(Controller).toHaveBeenCalledWith();
    expect(Controller).toHaveBeenCalledTimes(2);
  });

  it('should register all methods as gRPC methods', () => {
    class TestController {
      methodOne() {}
      methodTwo() {}
    }

    GrpcController()(TestController);

    const serviceName = 'TestService';
    expect(GrpcMethod).toHaveBeenCalledWith(serviceName, 'methodOne');
    expect(GrpcMethod).toHaveBeenCalledWith(serviceName, 'methodTwo');
    expect(GrpcMethod).toHaveBeenCalledTimes(2);
  });

  it('should not register the constructor as a gRPC method', () => {
    class TestController {
      constructor() {}
      methodOne() {}
    }

    GrpcController()(TestController);

    const serviceName = 'TestService';
    expect(GrpcMethod).toHaveBeenCalledWith(serviceName, 'methodOne');
    expect(GrpcMethod).not.toHaveBeenCalledWith(serviceName, 'constructor');
    expect(GrpcMethod).toHaveBeenCalledTimes(1);
  });
});

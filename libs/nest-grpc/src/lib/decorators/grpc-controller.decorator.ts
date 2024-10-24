import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

/**
 * Decorator that marks a class as a gRPC controller.
 *
 * This decorator applies the `Controller` decorator to the target class
 * and automatically registers all its methods as gRPC methods using the `GrpcMethod` decorator.
 * The gRPC service name is derived from the class name by replacing 'Controller' with 'Service'.
 *
 * @returns {ClassDecorator} The class decorator function.
 */
export function GrpcController(): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any) => {
    Controller()(target);
    const serviceName = target.name.replace('Controller', 'Service');
    for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
      const method = target.prototype[methodName];

      if (typeof method === 'function' && methodName !== 'constructor') {
        GrpcMethod(serviceName, methodName)(
          target.prototype,
          methodName,
          Object.getOwnPropertyDescriptor(target.prototype, methodName) || {}
        );
      }
    }
  };
}

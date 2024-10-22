import { ClientGrpcProxy, ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

/**
 * A utility class for creating gRPC client proxies for testing purposes.
 */
export class GrpcClientTesting {
  /**
   * Creates a gRPC client proxy for testing purposes.
   *
   * This method sets up a testing module with the specified gRPC options and returns
   * a `ClientGrpcProxy` instance that can be used to interact with the gRPC service.
   *
   * @param options - The gRPC options to configure the client.
   * @returns A promise that resolves to a `ClientGrpcProxy` instance.
   */
  static async createGrpcClient(options: GrpcOptions['options']): Promise<ClientGrpcProxy> {
    const module = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'GRPC_SERVICE',
            transport: Transport.GRPC,
            options: {
              ...options,
            },
          },
        ]),
      ],
    }).compile();
    return module.get<ClientGrpcProxy>('GRPC_SERVICE');
  }
}

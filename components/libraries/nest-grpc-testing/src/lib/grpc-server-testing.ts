import { DynamicModule, INestApplication, INestMicroservice, ModuleMetadata } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { isAbsolute, join } from 'path';
import { getPortPromise } from 'portfinder';

/**
 *
 * The class includes methods to:
 * - Create and start a gRPC server with specified proto file and package name.
 * - Stop the gRPC server.
 * - Continuously attempt to start the server until it succeeds.
 *
 * The `GrpcServerTesting` class is designed to facilitate the testing of gRPC services by providing a simple interface to manage the lifecycle of a gRPC server.
 *
 * Example usage:
 *
 * ```typescript
 * const grpcServer = await GrpcServerTesting.createGrpcServer(metadata, {
 *   protoFile: 'path/to/proto/file.proto',
 *   packageName: 'package.name',
 *   timeout: 10000,
 * });
 *
 * // Perform tests...
 *
 * await grpcServer.stop();
 * ```
 */
export class GrpcServerTesting {
  private static readonly DEFAULT_TIMEOUT = 10000;

  public options: GrpcOptions['options'];
  public application: INestApplication;
  public microservice: INestMicroservice;

  /**
   * Creates and starts a gRPC server for testing purposes.
   *
   * @param metadata - The module metadata or dynamic module to be used for creating the testing module.
   * @param options - Options for the gRPC server.
   * @param options.protoFile - The path to the proto file.
   * @param options.packageName - The package name defined in the proto file.
   * @param options.timeout - Optional timeout for the server start operation, defaults to 10000 milliseconds.
   * @returns A promise that resolves to an instance of `GrpcServerTesting`.
   *
   * TODO: Accept raw protobuf alternative for proto file
   */
  static async createGrpcServer(
    metadata: ModuleMetadata | DynamicModule,
    options: { protoFile: string; packageName: string; timeout?: number }
  ): Promise<GrpcServerTesting> {
    let module;
    if ('module' in metadata) {
      module = await Test.createTestingModule({ imports: [metadata as DynamicModule] }).compile();
    } else {
      module = await Test.createTestingModule(metadata).compile();
    }

    const instance = new GrpcServerTesting(module.createNestApplication());
    await instance.start(
      options.protoFile,
      options.packageName,
      options.timeout ?? GrpcServerTesting.DEFAULT_TIMEOUT
    );
    return instance;
  }

  private constructor(application: INestApplication) {
    this.application = application;
  }

  /**
   * Stops the gRPC server by closing the application.
   *
   * @returns {Promise<void>} A promise that resolves when the application is closed.
   */
  public async stop(): Promise<void> {
    await this.microservice.close();
    await this.application.close();
  }

  /**
   * Starts the gRPC server with the specified proto file and package name.
   *
   * @param protoFile - The path to the proto file.
   * @param packageName - The name of the package defined in the proto file.
   * @param timeout - Optional timeout in milliseconds to wait for the server to start. If the server does not start within this time, the promise will be rejected.
   * @returns A promise that resolves when the server has started or rejects if the server fails to start within the specified timeout.
   * @throws An error if the server cannot start within the specified timeout.
   */
  private async start(protoFile: string, packageName: string, timeout?: number): Promise<void> {
    return Promise.race([
      new Promise<void>((resolve) => {
        this.createGrpcServer(protoFile, packageName).then((options) => {
          process.stdout.write(`gRPC server started at ${options.url}\n\n\n`);
          this.options = options;
          resolve();
        });
      }),
      new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Can't start grpc server in time " + timeout + 'ms\n\n\n'));
        }, timeout);
      }),
    ]);
  }

  /**
   * Creates and starts a gRPC server with the specified proto file and package name.
   * This function will continuously attempt to start the server until it succeeds.
   *
   * @param protoFile - The name of the proto file to use for the gRPC server.
   * @param packageName - The name of the package defined in the proto file.
   * @returns A promise that resolves to the gRPC server options once the server is successfully started.
   * @throws Will retry indefinitely until the gRPC server is successfully started.
   */
  private async createGrpcServer(
    protoFile: string,
    packageName: string,
    lastPort?: number
  ): Promise<GrpcOptions['options']> {
    let port;
    try {
      port = await getPortPromise({ port: lastPort ?? undefined });
      const options: GrpcOptions = {
        transport: Transport.GRPC,
        options: {
          url: `127.0.0.1:${port}`,
          package: packageName,
          protoPath: isAbsolute(protoFile)
            ? protoFile
            : join(__dirname, '../../../service-protobuf/proto', protoFile),
        },
      };
      this.microservice = this.application.connectMicroservice(options, { inheritAppConfig: true });
      await this.application.startAllMicroservices();
      await this.application.init();
      return options.options;
    } catch (error) {
      process.stdout.write(`\n${error.stack}\n`);
      process.stdout.write('\x1b[33mFailed to start gRPC server, retrying...\x1b[0m\n');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.createGrpcServer(protoFile, packageName, port + 1);
    }
  }
}

import { GrpcServiceBootstrapModule, MongoDBConfigSchema } from '@ebizbase/nest-grpc';
import { GrpcClientTesting, GrpcServerTesting } from '@ebizbase/nest-grpc-testing';
import { firstValueFrom } from 'rxjs';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { AppModule } from './app.module';
import { localize } from '../protobuf/localize';

describe('AppModule intergration test', () => {
  const DATABASE_NAME = 'localize';
  const SERVER_START_TIMEOUT = 12000;
  const SETUP_TIMEOUT = 30000;

  let mongoContainer: StartedTestContainer;
  let grpcServer: GrpcServerTesting;
  let grpcService: localize.LocalizeService;

  beforeAll(async () => {
    process.stdout.write('Starting server');
    process.env.LOG_FORMAT = 'text';
    process.env.LOG_LEVEL = 'trace';

    mongoContainer = await new GenericContainer('docker.io/mongo:4.4')
      .withExposedPorts(27017)
      .withEnvironment({ MONGO_INITDB_DATABASE: DATABASE_NAME })
      .start();

    const mongoUri = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}`;
    process.env.MONGODB_URL = mongoUri;
    process.env.MONGODB_DATABASE = DATABASE_NAME;

    grpcServer = await GrpcServerTesting.createGrpcServer(
      GrpcServiceBootstrapModule.launch(AppModule, [MongoDBConfigSchema]),
      {
        packageName: 'localize',
        protoFile: 'localize.proto',
        timeout: SERVER_START_TIMEOUT,
      }
    );
    grpcService = (
      await GrpcClientTesting.createGrpcClient(grpcServer.options)
    ).getService<localize.LocalizeService>('LocalizeService');
  }, SETUP_TIMEOUT);

  afterAll(async () => {
    process.stdout.write('Closing server');
    await grpcServer.stop();
    await mongoContainer.stop({
      removeVolumes: true,
      remove: true,
    });
  });

  describe('Active Languages', () => {
    it('should return active language', async () => {
      const request = grpcService.getActiveLanguages({});
      const { activeLanguages } = await firstValueFrom(request);
      expect(activeLanguages).toEqual([
        { id: expect.any(String), code: 'en', name: 'English', isDefault: true },
        { id: expect.any(String), code: 'vi', name: 'Tiếng Việt', isDefault: false },
      ]);
    });
  });
});

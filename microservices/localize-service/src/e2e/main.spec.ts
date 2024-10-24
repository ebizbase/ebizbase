import { GrpcServiceBootstrapModule, MongoDBConfigSchema } from '@ebizbase/nest-grpc';
import { GrpcClientTesting, GrpcServerTesting } from '@ebizbase/nest-grpc-testing';
import { firstValueFrom } from 'rxjs';
import { AppModule } from '../app/app.module';
import { localize } from '../protobuf';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';

describe('Main E2e Spec', () => {
  const DATABASE_NAME = 'localize';
  const SERVER_START_TIMEOUT = 12000;
  const SETUP_TIMEOUT = 30000;

  let mongoContainer: StartedMongoDBContainer;
  let grpcServer: GrpcServerTesting;
  let grpcService: localize.LocalizeService;

  beforeAll(async () => {
    process.stdout.write('Starting server');
    process.env.LOG_FORMAT = 'text';
    process.env.LOG_LEVEL = 'trace';

    mongoContainer = await new MongoDBContainer('docker.io/mongo:4.4').start();

    const mongoUri = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}`;
    process.env.MONGODB_URL = mongoUri;
    process.env.MONGODB_DATABASE = DATABASE_NAME;
    process.env.MONGODB_OPTIONS = 'directConnection=true';

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

  describe('Get languages', () => {
    it('should return all language', async () => {
      const { languages } = await firstValueFrom(grpcService.listLanguages({}));
      expect(languages.length).toBe(84);
      expect(languages.filter((language) => language.isDefault).length).toBe(1);
      expect(languages.find((language) => language.isDefault).code).toBe('en');
    });
  });

  describe('Change default language', () => {
    it('should return all language', async () => {
      const { languages } = await firstValueFrom(grpcService.listLanguages({}));
      const newDefaultLanguage = languages.find((language) => !language.isDefault);

      await firstValueFrom(grpcService.changeDefaultLanguage({ id: newDefaultLanguage.id }));

      const newResults = await firstValueFrom(grpcService.listLanguages({}));
      expect(newResults.languages.find((language) => language.isDefault).id).toBe(
        newDefaultLanguage.id
      );
    });
  });
});

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let configService: ConfigService;
  let envConfig: { [key: string]: string };

  beforeEach(() => {
    envConfig = {
      API_URL: 'http://localhost:3000',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
    };
    configService = new ConfigService(envConfig);
  });

  it('should return the correct value for a given key', () => {
    expect(configService.get<{ API_URL: string }>('API_URL')).toBe('http://localhost:3000');
    expect(configService.get<{ DB_HOST: string }>('DB_HOST')).toBe('localhost');
    expect(configService.get<{ DB_PORT: string }>('DB_PORT')).toBe('5432');
  });

  it('should return undefined for a non-existent key', () => {
    expect(configService.get<{ NON_EXISTENT_KEY: string }>('NON_EXISTENT_KEY')).toBeUndefined();
  });
});

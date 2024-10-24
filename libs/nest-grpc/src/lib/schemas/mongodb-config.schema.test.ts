import { validate } from 'class-validator';
import { MongoDBConfigSchema } from './mongodb-config.schema';
import { MongooseModule } from '@nestjs/mongoose';

const VALID_CONFIG = {
  MONGODB_URL: 'mongodb://user:password@localhost:27017',
  MONGODB_DATABASE: 'my_database',
  MONGODB_OPTIONS: 'retryWrites=true&w=majority',
};

describe('MongoDbConfigSchema', () => {
  describe('MONGODB_URL', () => {
    test.each([
      {
        description: 'should validate successfully with MONGODB_URL starting with mongodb+srv://',
        MONGODB_URL: 'mongodb+srv://user:password@cluster.mongodb.net',
        expectedError: null,
      },
      {
        description: 'should validate successfully with MONGODB_URL starting with mongodb://',
        MONGODB_URL: 'mongodb://user:password@localhost:27017',
        expectedError: null,
      },
      {
        description: 'should validate successfully with MONGODB_URL without port number',
        MONGODB_URL: 'mongodb://user:password@cluster.mongodb.net',
        expectedError: null,
      },
      {
        description: 'should validate successfully with MONGODB_URL without password',
        MONGODB_URL: 'mongodb://user@localhost:27017',
        expectedError: null,
      },
      {
        description: 'should validate successfully with MONGODB_URL without username and password',
        MONGODB_URL: 'mongodb://localhost:27017',
        expectedError: null,
      },
      {
        description:
          'should validate successfully with MONGODB_URL without username and password and port number',
        MONGODB_URL: 'mongodb://user@localhost',
        expectedError: null,
      },
      {
        description: 'should fail when MONGODB_URL is undefined',
        MONGODB_URL: undefined,
        expectedError: 'MONGODB_URL is required.',
      },
      {
        description: 'should fail when MONGODB_URL is empty string',
        MONGODB_URL: '',
        expectedError: 'MONGODB_URL is required.',
      },
      {
        description: 'should fail when MONGODB_URL is invalid',
        MONGODB_URL: 'invalid_url',
        expectedError:
          'MONGODB_URL must be a valid MongoDB connection URL starting with "mongodb://" or "mongodb+srv://" and should not contain database name and options. Example: "mongodb://user:password@localhost:27017" or "mongodb+srv://cluster.mongodb.net".',
      },
      {
        description: 'should fail when MONGODB_URL contains database name',
        MONGODB_URL: 'mongodb://user:password@localhost:27017/mydb',
        expectedError:
          'MONGODB_URL must not contain a database name. use MONGODB_DATABASE instead. (Current: mongodb://user:password@localhost:27017/mydb)',
      },
      {
        description: 'should fail when MONGODB_URL contains options',
        MONGODB_URL: 'mongodb://user:password@localhost:27017?retryWrites=true&w=majority',
        expectedError:
          'MONGODB_URL must not contain options. use MONGODB_OPTIONS instead. (Current: mongodb://user:password@localhost:27017?retryWrites=true&w=majority)',
      },
    ])('$description', async ({ MONGODB_URL, expectedError }) => {
      const invalidConfig = new MongoDBConfigSchema();
      if (MONGODB_URL === undefined) {
        const { MONGODB_URL, ...rest } = VALID_CONFIG;
        Object.assign(invalidConfig, rest);
      } else {
        Object.assign(invalidConfig, { ...VALID_CONFIG, MONGODB_URL });
      }
      const errors = await validate(invalidConfig);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['matches']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('MONGODB_DATABASE', () => {
    test.each([
      {
        description: 'should validate successfully with valid MONGODB_DATABASE',
        MONGODB_DATABASE: 'my_database',
        expectedError: null,
      },
      {
        description: 'should validate successfully with valid MONGODB_DATABASE',
        MONGODB_DATABASE: undefined,
        expectedError: 'MONGODB_DATABASE is required.',
      },
      {
        description: 'should validate successfully with valid MONGODB_DATABASE',
        MONGODB_DATABASE: '',
        expectedError: 'MONGODB_DATABASE is required.',
      },
      {
        description: 'should fail when MONGODB_DATABASE starts with /',
        MONGODB_DATABASE: '/my_database',
        expectedError: 'MONGODB_DATABASE must not start with a slash.',
      },
      {
        description: 'should fail when MONGODB_DATABASE contains invalid characters',
        MONGODB_DATABASE: 'my database',
        expectedError: 'MONGODB_DATABASE must be a valid MongoDB database name.',
      },
    ])('$description', async ({ MONGODB_DATABASE, expectedError }) => {
      const invalidConfig = new MongoDBConfigSchema();

      if (MONGODB_DATABASE === undefined) {
        const { MONGODB_DATABASE, ...rest } = VALID_CONFIG;
        Object.assign(invalidConfig, rest);
      } else {
        Object.assign(invalidConfig, { ...VALID_CONFIG, MONGODB_DATABASE });
      }
      const errors = await validate(invalidConfig);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['matches']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('MONGODB_OPTIONS', () => {
    test.each([
      {
        description: 'should validate successfully with valid MONGODB_OPTIONS',
        MONGODB_OPTIONS: 'retryWrites=true&w=majority',
        expectedError: null,
      },
      {
        description: 'should validate successfully when MONGODB_OPTIONS is undefined',
        MONGODB_OPTIONS: undefined,
        expectedError: null,
      },
      {
        description: 'should validate successfully with valid MONGODB_OPTIONS is an empty string',
        MONGODB_OPTIONS: '',
        expectedError: null,
      },
      {
        description: 'should fail when MONGODB_OPTIONS starts with ?',
        MONGODB_OPTIONS: '?retryWrites=true&w=majority',
        expectedError: 'MONGODB_OPTIONS must not start with a question mark.',
      },
      {
        description: 'should fail when MONGODB_OPTIONS contains invalid characters',
        MONGODB_OPTIONS: 'retryWrites?true&w=majority&invalidOption',
        expectedError:
          'MONGODB_OPTIONS should be a valid connection option string. Example: "retryWrites=true&w=majority".',
      },
    ])('$description', async ({ MONGODB_OPTIONS, expectedError }) => {
      const invalidConfig = new MongoDBConfigSchema();
      Object.assign(invalidConfig, { ...VALID_CONFIG, MONGODB_OPTIONS });

      const errors = await validate(invalidConfig);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['matches']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('imports', () => {
    test('should return a valid MongooseModule configuration', () => {
      const config = new MongoDBConfigSchema();
      Object.assign(config, VALID_CONFIG);
      const imports = config.imports();
      expect(imports.length).toBe(1);
      expect(imports[0]).toEqual(expect.anything());
    });

    test('should log the correct URI', () => {
      const config = new MongoDBConfigSchema();
      Object.assign(config, VALID_CONFIG);
      const loggerSpy = jest.spyOn(config['logger'], 'trace');
      config.imports();
      const expectedUri = `${VALID_CONFIG.MONGODB_URL}/${VALID_CONFIG.MONGODB_DATABASE}?${VALID_CONFIG.MONGODB_OPTIONS}`;
      expect(loggerSpy).toHaveBeenCalledWith(
        `Initializing MongooseModule import statement ${expectedUri}`
      );
    });
  });
});

import { validate } from 'class-validator';
import { RedisConfigSchema } from './redis-config.schema';
const VALID_CONFIG = {
  REDIS_URL: 'localhost:6379',
  REDIS_USERNAME: 'user',
  REDIS_PASSWORD: 'pass',
};

describe('RedisConfigSchema', () => {
  describe('REDIS_URL', () => {
    test.each([
      {
        description: 'should validate successfully with a single valid Redis URL',
        REDIS_URL: 'localhost:6379',
        expectedError: null,
      },
      {
        description: 'should validate successfully with multiple valid Redis URLs',
        REDIS_URL: 'localhost:6379,localhost:6373,localhost:6372',
        expectedError: null,
      },
      {
        description: 'should fail with invalid Redis URL',
        REDIS_URL: 'example..com',
        expectedError:
          'Each node in REDIS_URL must be a valid Redis URL. Example: "localhost:6379" or "localhost" or "node1:6379,node2,node3"',
      },
      {
        description: 'should fail when contain invalid Redis URL',
        REDIS_URL: 'localhost:6379,example..com,localhost:6372',
        expectedError:
          'Each node in REDIS_URL must be a valid Redis URL. Example: "localhost:6379" or "localhost" or "node1:6379,node2,node3"',
      },
      {
        description: 'should fail when REDIS_URL is empty',
        REDIS_URL: undefined,
        expectedError: 'REDIS_URL is required.',
      },
      {
        description: 'should fail when REDIS_URL is empty',
        REDIS_URL: '',
        expectedError: 'REDIS_URL is required.',
      },
    ])('$description', async ({ REDIS_URL, expectedError }) => {
      const config = new RedisConfigSchema();

      if (REDIS_URL === undefined) {
        const { REDIS_URL, ...rest } = VALID_CONFIG;
        Object.assign(config, rest);
      } else {
        Object.assign(config, { ...VALID_CONFIG, REDIS_URL });
      }

      const errors = await validate(config);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['isValidRedisUrl']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('REDIS_USERNAME', () => {
    test.each([
      {
        description: 'should validate successfully with valid username',
        REDIS_USERNAME: 'user',
        expectedError: null,
      },
      {
        description: 'should validate successfully without username',
        REDIS_USERNAME: undefined,
        expectedError: "REDIS_USERNAME is not required. But can't set empty string",
      },
      {
        description: 'should fail when username is empty',
        REDIS_USERNAME: '',
        expectedError: "REDIS_USERNAME is not required. But can't set empty string",
      },
    ])('$description', async ({ REDIS_USERNAME, expectedError }) => {
      const config = new RedisConfigSchema();
      if (REDIS_USERNAME === undefined) {
        const { REDIS_USERNAME, ...rest } = VALID_CONFIG;
        Object.assign(config, rest);
      } else {
        Object.assign(config, { ...VALID_CONFIG, REDIS_USERNAME });
      }

      const errors = await validate(config);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}))[0];
        expect(errorMessages).toContain(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('REDIS_PASSWORD', () => {
    test.each([
      {
        description: 'should validate successfully with valid password',
        REDIS_PASSWORD: 'pass',
        expectedError: null,
      },
      {
        description: 'should validate successfully without password',
        REDIS_PASSWORD: undefined,
        expectedError: "REDIS_PASSWORD is not required. But can't set empty string",
      },
      {
        description: 'should fail when password is empty',
        REDIS_PASSWORD: '',
        expectedError: "REDIS_PASSWORD is not required. But can't set empty string",
      },
    ])('$description', async ({ REDIS_PASSWORD, expectedError }) => {
      const config = new RedisConfigSchema();
      if (REDIS_PASSWORD === undefined) {
        const { REDIS_PASSWORD, ...rest } = VALID_CONFIG;
        Object.assign(config, rest);
      } else {
        Object.assign(config, { ...VALID_CONFIG, REDIS_PASSWORD });
      }

      const errors = await validate(config);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}))[0];
        expect(errorMessages).toContain(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });
});

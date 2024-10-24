import { validate } from 'class-validator';
import { RabbitMQConfigSchema } from './rabbitmq-config.schema';

const VALID_CONFIG = {
  RABBITMQ_URL: 'amqp://user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672/vhost',
  RABBITMQ_VIRTUAL_HOST: 'my_vhost',
};

describe('RabbitMQConfigSchema', () => {
  describe('RABBITMQ_URL', () => {
    test.each([
      {
        description: 'should validate successfully with a valid RabbitMQ URL',
        RABBITMQ_URL: 'amqp://user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672/vhost',
        expectedError: null,
      },
      {
        description: 'should fail when RABBITMQ_URL is empty',
        RABBITMQ_URL: '',
        expectedError: 'RABBITMQ_URL is required.',
      },
      {
        description: 'should fail when RABBITMQ_URL is missing the protocol',
        RABBITMQ_URL: 'user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672/vhost',
        expectedError:
          'RABBITMQ_URL must be a valid RabbitMQ connection URL. Example: "amqp://user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672".',
      },
      {
        description: 'should fail when RABBITMQ_URL is missing the username and password',
        RABBITMQ_URL: 'amqp://rabbit1.example.com:5672,rabbit2.example.com:5672/vhost',
        expectedError:
          'RABBITMQ_URL must be a valid RabbitMQ connection URL. Example: "amqp://user:pass@rabbit1.example.com:5672,rabbit2.example.com:5672".',
      },
    ])('$description', async ({ RABBITMQ_URL, expectedError }) => {
      const config = new RabbitMQConfigSchema();
      if (RABBITMQ_URL === undefined) {
        const { RABBITMQ_URL, ...rest } = VALID_CONFIG;
        Object.assign(config, rest);
      } else {
        Object.assign(config, { ...VALID_CONFIG, RABBITMQ_URL });
      }

      const errors = await validate(config);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['matches']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('RABBITMQ_VIRTUAL_HOST', () => {
    test.each([
      {
        description: 'should validate successfully with a valid virtual host',
        RABBITMQ_VIRTUAL_HOST: 'my_vhost',
        expectedError: null,
      },
      {
        description: 'should fail when RABBITMQ_VIRTUAL_HOST is empty',
        RABBITMQ_VIRTUAL_HOST: '',
        expectedError: 'RABBITMQ_VIRTUAL_HOST is required.',
      },
      {
        description: 'should fail when RABBITMQ_VIRTUAL_HOST contains invalid characters',
        RABBITMQ_VIRTUAL_HOST: 'my vhost',
        expectedError:
          'RABBITMQ_VIRTUAL_HOST must be a valid virtual host string without starting with "/". Example: "my_vhost".',
      },
      {
        description: 'should fail when RABBITMQ_VIRTUAL_HOST starts with a slash',
        RABBITMQ_VIRTUAL_HOST: '/my_vhost',
        expectedError:
          'RABBITMQ_VIRTUAL_HOST must be a valid virtual host string without starting with "/". Example: "my_vhost".',
      },
    ])('$description', async ({ RABBITMQ_VIRTUAL_HOST, expectedError }) => {
      const config = new RabbitMQConfigSchema();
      if (RABBITMQ_VIRTUAL_HOST === undefined) {
        const { RABBITMQ_VIRTUAL_HOST, ...rest } = VALID_CONFIG;
        Object.assign(config, rest);
      } else {
        Object.assign(config, { ...VALID_CONFIG, RABBITMQ_VIRTUAL_HOST });
      }

      const errors = await validate(config);
      if (expectedError) {
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]?.constraints?.['matches']).toBe(expectedError);
      } else {
        expect(errors.length).toBe(0);
      }
    });
  });
});

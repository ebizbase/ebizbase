import { ConfigSchema } from './schema.abstract';

class TestConfigSchema extends ConfigSchema {}

describe('ConfigSchema', () => {
  let configSchema: ConfigSchema;

  beforeEach(() => {
    configSchema = new TestConfigSchema();
  });

  it('should return an empty array for imports', () => {
    expect(configSchema.imports()).toEqual([]);
  });

  it('should return an empty array for providers', () => {
    expect(configSchema.providers()).toEqual([]);
  });
});

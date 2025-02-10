import { Test, TestingModule } from '@nestjs/testing';

import { HttpLoggerModule } from './http-logger.module';
import { HttpLoggerOptions } from './http-logger.options';

describe('HttpLoggerModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [HttpLoggerModule.forRoot({} as HttpLoggerOptions)],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should throw an error if instantiated more than once', () => {
    expect(() => new HttpLoggerModule()).toThrow(
      'HttpLoggerModule has already been instantiated. Please, import it only in the root module!'
    );
  });
});

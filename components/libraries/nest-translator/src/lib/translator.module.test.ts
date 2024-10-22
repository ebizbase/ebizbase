import { Test, TestingModule } from '@nestjs/testing';
import { TranslatorModule } from './translator.module';
import { Translator } from './translator';

describe('TranslatorModule', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TranslatorModule.registerAsync({
          useFactory: async () => ({
            translator: {} as Translator,
          }),
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});

import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Translator } from './translator';
import { TranslatorContext } from './translator.context';
import { TranslatorInterceptor } from './translator.interceptor';

describe('TranslatorInterceptor', () => {
  let interceptor: TranslatorInterceptor;
  let translator: Translator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslatorInterceptor,
        {
          provide: Translator,
          useValue: {
            // Mock Translator methods if needed
          },
        },
        {
          provide: EliteLogger,
          useValue: {
            trace: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<TranslatorInterceptor>(TranslatorInterceptor);
    translator = module.get<Translator>(Translator);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log the language and call TranslatorContext.create', () => {
    const context = {
      switchToRpc: jest.fn().mockReturnValue({
        getContext: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue(['en']),
        }),
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };

    const createSpy = jest.spyOn(TranslatorContext, 'create').mockReturnValue(of({}));

    interceptor.intercept(context, next);

    expect(context.switchToRpc().getContext().get).toHaveBeenCalledWith('language');
    expect(createSpy).toHaveBeenCalledWith(expect.any(TranslatorContext), next);
  });
});

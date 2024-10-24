import { Optional } from '@ebizbase/common-types';
import { CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { Translator } from './translator';
import { TranslatorContext } from './translator.context';

describe('TranslatorContext', () => {
  let translator: Translator;
  let context: TranslatorContext;

  beforeEach(() => {
    translator = {
      translate: jest.fn(
        (key: string, language: Optional<string>, defaultValue: string) =>
          `${key}-${language}-${defaultValue}`
      ),
    } as unknown as Translator;
    context = new TranslatorContext(translator, 'en');
  });

  it('should translate a key using the translator', () => {
    const result = context.translate('hello', 'default', 'description');
    expect(result).toBe('hello-en-default');
    expect(translator.translate).toHaveBeenCalledWith('hello', 'en', 'default');
  });

  it('should create a new context and run the next handler', (done) => {
    const next: CallHandler = {
      handle: jest.fn(() => of('test')),
    };

    const ctx = new TranslatorContext(translator, 'en');
    const observable = TranslatorContext.create(ctx, next);

    observable.subscribe({
      next: (value) => {
        expect(value).toBe('test');
        expect(next.handle).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should return the current context', () => {
    const ctx = new TranslatorContext(translator, 'en');
    TranslatorContext.create(ctx, {
      handle: jest.fn(() => of('test')),
    }).subscribe(() => {
      const currentContext = TranslatorContext.current();
      expect(currentContext).toBe(ctx);
    });
  });

  it('should return undefined if no context is set', () => {
    const currentContext = TranslatorContext.current();
    expect(currentContext).toBeUndefined();
  });
});

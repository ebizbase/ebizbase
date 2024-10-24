import { Optional } from '@ebizbase/common-types';
import { CallHandler, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { Translator } from './translator';

export class TranslatorContext {
  private static readonly logger = new Logger(TranslatorContext.name);
  private static storage = new AsyncLocalStorage<TranslatorContext>();
  constructor(readonly translator: Translator, readonly language: Optional<string>) {}

  translate(
    key: string,
    defaultValue: string,
    _description: string,
    _interpolateParams?: object
  ): string {
    return this.translator.translate(key, this.language, defaultValue);
  }

  static create(ctx: TranslatorContext, next: CallHandler): Observable<unknown> {
    return new Observable((subscriber) => {
      this.storage.run(ctx, () => {
        next.handle().subscribe(subscriber);
      });
    });
  }

  static current(): TranslatorContext | undefined {
    const i18n = this.storage.getStore() as TranslatorContext | undefined;
    return i18n;
  }
}

import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Translator } from './translator';
import { TranslatorContext } from './translator.context';

export class TranslatorInterceptor implements NestInterceptor {
  private logger = new EliteLogger(TranslatorInterceptor.name);

  constructor(private translator: Translator) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = context.switchToRpc().getContext() as Metadata;
    const [language] = metadata.get('language') as Array<string>;
    this.logger.trace(language, 'Getting language from metadata');
    return TranslatorContext.create(new TranslatorContext(this.translator, language), next);
  }
}

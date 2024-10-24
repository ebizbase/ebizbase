import { Metadata } from '@grpc/grpc-js';
import { from, map, Observable } from 'rxjs';
import { common, google, localize } from '../../protobuf';
import { GrpcController } from '@ebizbase/nest-grpc';
import { LanguageService } from '../services/localize.service';

@GrpcController()
export class LocalizeController implements localize.LocalizeService {
  constructor(private languageService: LanguageService) { }

  listLanguages(data: common.Listing, metadata?: Metadata): Observable<localize.Languages> {
    return from(this.languageService.getLanguages(data, metadata)).pipe(
      map((languages) => ({ languages }))
    )
  }

  changeDefaultLanguage({ id }: localize.ChangeDefaultLanguageRequest, metadata?: Metadata): Observable<google.protobuf.Empty> {
    return from(this.languageService.changeDefaultLanguage(id, metadata))
      .pipe(map(() => ({})))
  }

  listTranslations(data: common.Listing, metadata?: Metadata): Observable<localize.Translations> {
    return from(this.languageService.listTranslations(data, metadata))
      .pipe(map((translations) => ({ translations })))
  }

  updateTranslation(data: localize.UpdateTranslactionRequest, metadata?: Metadata): Observable<localize.Translations> {
    return from(this.languageService.updateTranslation(data, metadata))
      .pipe(map(() => ({})))
  }



}

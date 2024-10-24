import { Metadata } from '@grpc/grpc-js';
import { from, map, Observable } from 'rxjs';
import { google, localize } from '../../protobuf';
import { GrpcController } from '@ebizbase/nest-grpc';
import { LanguageService } from '../services/language.service';

@GrpcController()
export class LocalizeController {
  constructor(private languageService: LanguageService) {}

  getActiveLanguages(
    data: google.protobuf.Empty,
    metadata?: Metadata
  ): Observable<localize.ActiveLanguagesResponse> {
    return from(this.languageService.getActiveLanguages(metadata)).pipe(
      map((languages) => {
        return { activeLanguages: languages };
      })
    );
  }
}

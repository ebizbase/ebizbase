import { ApplicationConfig } from '@angular/core';
import { provideCommon } from '@ebizbase/angular-common';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [...provideCommon(appRoutes)],
};

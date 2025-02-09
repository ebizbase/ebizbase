import { ApplicationConfig } from '@angular/core';
import { provideEcommaSite } from '@ebizbase/angular-common';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideEcommaSite(appRoutes)],
};

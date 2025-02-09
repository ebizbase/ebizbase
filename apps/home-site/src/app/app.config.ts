import { ApplicationConfig } from '@angular/core';
import { provideEcommaHomeSiteMark, provideEcommaSite } from '@ebizbase/angular-common';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideEcommaSite(appRoutes, true), provideEcommaHomeSiteMark()],
};

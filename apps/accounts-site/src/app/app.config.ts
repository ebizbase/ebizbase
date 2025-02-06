import { ApplicationConfig } from '@angular/core';
import { provideEbbSite } from '@ebizbase/angular-site';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideEbbSite(appRoutes)],
};

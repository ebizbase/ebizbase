import { ApplicationConfig } from '@angular/core';
import { provideHomeSiteMark } from '@ebizbase/angular-domain';
import { provideEbbSite } from '@ebizbase/angular-site';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideEbbSite(appRoutes, true), provideHomeSiteMark()],
};

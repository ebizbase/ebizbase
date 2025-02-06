import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  isDevMode,
  PLATFORM_ID,
  provideAppInitializer,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Route } from '@angular/router';
import { provideEbbAsset } from '@ebizbase/angular-asset';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

export const provideEbbSite = (
  appRoutes: Route[],
  ssr = false
): Array<Provider | EnvironmentProviders> => [
  ...(ssr ? [provideClientHydration(withEventReplay(), withIncrementalHydration())] : []),
  provideAnimations(),
  provideHttpClient(withFetch()),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(appRoutes),
  NG_EVENT_PLUGINS,
  provideEbbAsset(),
  provideAppInitializer(async () => {
    // Display Xss waring
    if (isPlatformBrowser(inject(PLATFORM_ID)) && !isDevMode()) {
      console.log(
        '%c** STOP **',
        'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;'
      );
      console.log(
        '\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.',
        'font-weight:bold; font: 2em Arial; color: #e11d48;'
      );
    }
  }),
];

import { isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
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
import { WA_WINDOW } from '@ng-web-apis/common';
import { TUI_ICON_RESOLVER } from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { SystemUrl } from '.';
import { AuthenticateInterceptor } from '../interceptors/authenticate.interceptor';

export const provideCommon = (appRoutes: Route[]) =>
  [
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    NG_EVENT_PLUGINS,
    provideAppInitializer(async () => {
      const { AssetsBaseURL } = inject(SystemUrl);
      const { document } = inject(WA_WINDOW);

      // Set favicons
      if (!document.getElementById('favicon')) {
        const link = document.createElement('link');
        link.id = 'favicon';
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = `${AssetsBaseURL}/favicon.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      // Display Xss waring
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticateInterceptor,
      multi: true,
    },
    {
      provide: TUI_ICON_RESOLVER,
      deps: [SystemUrl],
      useFactory({ IconsBaseURL }: SystemUrl) {
        return (name: string) => {
          return name.startsWith('@')
            ? `${IconsBaseURL}/${name.slice(1).replace('.', '/')}.svg`
            : name;
        };
      },
    },
  ] as Array<Provider | EnvironmentProviders>;

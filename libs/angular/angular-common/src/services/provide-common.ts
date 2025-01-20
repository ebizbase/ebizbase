import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
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
      console.log(AssetsBaseURL);
      if (!document.getElementById('favicon')) {
        const link = document.createElement('link');
        link.id = 'favicon';
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = `${AssetsBaseURL}/favicon.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
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

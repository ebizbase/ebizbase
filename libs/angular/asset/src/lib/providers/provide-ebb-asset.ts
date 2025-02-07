import { EnvironmentProviders, inject, provideAppInitializer, Provider } from '@angular/core';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { WA_WINDOW } from '@ng-web-apis/common';
import { TUI_ICON_RESOLVER } from '@taiga-ui/core';

export const provideEbbAsset = () =>
  [
    provideAppInitializer(async () => {
      const { document } = inject(WA_WINDOW);
      const domain = inject(EbbDomain);
      // Set favicons
      if (document.querySelectorAll('link[rel="icon"]').length === 0) {
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = `${domain.getUrl(DOMAIN_COMPONENTS.ASSET)}/favicon.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }),
    {
      provide: TUI_ICON_RESOLVER,
      deps: [EbbDomain],
      useFactory(domain: EbbDomain) {
        const assetsBaseUrl = domain.getUrl(DOMAIN_COMPONENTS.ASSET);
        return (name: string) => {
          return name.startsWith('@')
            ? `${assetsBaseUrl}/${name.slice(1).replace('.', '/')}.svg`
            : name;
        };
      },
    },
  ] as Array<Provider | EnvironmentProviders>;

import { Inject, Injectable, Optional } from '@angular/core';
import { WA_LOCATION } from '@ng-web-apis/common';

export const IS_HOME_SITE = 'IS_HOME_SITE';

export function provideHomeSiteMark() {
  return {
    provide: IS_HOME_SITE,
    useValue: true,
  };
}

export enum DOMAIN_COMPONENTS {
  ASSET,
  HOME_SITE,
  ACCOUNTS_SITE,
  MY_ACCOUNT_SITE,
  IAM_SERVICE,
}

@Injectable({ providedIn: 'root' })
export class EbbDomain {
  public readonly Protocol: string;
  public readonly RootDomain: string;

  constructor(
    @Inject(WA_LOCATION) private location: Location,
    @Optional() @Inject(IS_HOME_SITE) private isHomeSite: true | null
  ) {
    this.Protocol = this.location.protocol.slice(0, -1);
    if (this.isHomeSite) {
      this.RootDomain = this.location.host;
    } else {
      this.RootDomain = this.location.host.split('.').slice(1).join('.');
    }
    console.log('EbbDomain Initialize', {
      domain: this.RootDomain,
      protocol: this.Protocol,
      location: this.location,
    });
  }

  getUrl(component: DOMAIN_COMPONENTS) {
    switch (component) {
      case DOMAIN_COMPONENTS.ASSET:
        return `${this.Protocol}://assets.${this.RootDomain}`;
      case DOMAIN_COMPONENTS.HOME_SITE:
        return `${this.Protocol}://${this.RootDomain}`;
      case DOMAIN_COMPONENTS.ACCOUNTS_SITE:
        return `${this.Protocol}://accounts.${this.RootDomain}`;
      case DOMAIN_COMPONENTS.MY_ACCOUNT_SITE:
        return `${this.Protocol}://my-account.${this.RootDomain}`;
      case DOMAIN_COMPONENTS.IAM_SERVICE:
        return `${this.Protocol}://iam-service.${this.RootDomain}`;
      default:
        throw new Error(`Unknown component: ${component}`);
    }
  }
}

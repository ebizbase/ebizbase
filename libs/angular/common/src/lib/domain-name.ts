import { Inject, Injectable, Optional } from '@angular/core';
import { WA_LOCATION } from '@ng-web-apis/common';

export const IS_HOME_SITE = 'IS_HOME_SITE';

export function provideEcommaHomeSiteMark() {
  return {
    provide: IS_HOME_SITE,
    useValue: true,
  };
}

export enum DOMAIN_NAME_COMPONENTS {
  HOME_SITE,
  ACCOUNTS_SITE,
  MY_ACCOUNT_SITE,
  POLICIES_SITE,
  IAM_SERVICE,
}

@Injectable({ providedIn: 'root' })
export class DomainName {
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
  }

  getUrl(component: DOMAIN_NAME_COMPONENTS) {
    switch (component) {
      case DOMAIN_NAME_COMPONENTS.HOME_SITE:
        return `${this.Protocol}://${this.RootDomain}`;
      case DOMAIN_NAME_COMPONENTS.ACCOUNTS_SITE:
        return `${this.Protocol}://accounts.${this.RootDomain}`;
      case DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE:
        return `${this.Protocol}://my-account.${this.RootDomain}`;
      case DOMAIN_NAME_COMPONENTS.POLICIES_SITE:
        return `${this.Protocol}://policies.${this.RootDomain}`;
      case DOMAIN_NAME_COMPONENTS.IAM_SERVICE:
        return `${this.Protocol}://iam-service.${this.RootDomain}`;
      default:
        throw new Error(`Unknown component: ${component}`);
    }
  }

  isOnComponent(component: DOMAIN_NAME_COMPONENTS) {
    console.log(this.location.href, this.getUrl(component));
    return this.location.protocol + '//' + this.location.host === this.getUrl(component);
  }
}

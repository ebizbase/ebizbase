import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Authenticate, DOMAIN_NAME_COMPONENTS, DomainName } from '@ebizbase/angular-common';
import { WA_LOCATION } from '@ng-web-apis/common';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  protected authenticateService: Authenticate = inject(Authenticate);
  protected location: Location = inject(WA_LOCATION);
  protected router: Router = inject(Router);
  protected domain: DomainName = inject(DomainName);

  canActivate(): boolean | UrlTree {
    if (!this.authenticateService.isLoggedIn) {
      this.location.href =
        this.domain.getUrl(DOMAIN_NAME_COMPONENTS.ACCOUNTS_SITE) +
        `/?continue=${this.location.href}`;
      return false;
    }
    return true;
  }
}

import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { EbbAuthenticate } from '@ebizbase/angular-authenticate';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { WA_LOCATION } from '@ng-web-apis/common';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  protected authenticateService: EbbAuthenticate = inject(EbbAuthenticate);
  protected location: Location = inject(WA_LOCATION);
  protected router: Router = inject(Router);
  protected domain: EbbDomain = inject(EbbDomain);

  canActivate(): boolean | UrlTree {
    if (!this.authenticateService.isLoggedIn) {
      this.location.href =
        this.domain.getUrl(DOMAIN_COMPONENTS.ACCOUNTS_SITE) + `/?continue=${this.location.href}`;
      return false;
    }
    return true;
  }
}

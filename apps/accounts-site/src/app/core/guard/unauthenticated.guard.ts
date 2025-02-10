import { inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Authenticate, DOMAIN_NAME_COMPONENTS, DomainName } from '@ebizbase/angular-common';
import { WA_LOCATION } from '@ng-web-apis/common';

@Injectable({ providedIn: 'root' })
export class UnauthenticatedGuard implements CanActivate {
  private authenticate: Authenticate = inject(Authenticate);
  private location: Location = inject(WA_LOCATION);
  private domain: DomainName = inject(DomainName);

  canActivate(): boolean | UrlTree {
    if (this.authenticate.isLoggedIn) {
      const urlParams = new URLSearchParams(this.location.search);
      const continueUrl = urlParams.get('continue');
      this.location.href =
        continueUrl ?? this.domain.getUrl(DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE);
      return false;
    }
    return true;
  }
}

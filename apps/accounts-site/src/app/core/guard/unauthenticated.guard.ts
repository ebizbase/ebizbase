import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { WA_LOCATION } from '@ng-web-apis/common';
import { AuthenticateService } from '../services/authenticate.service';

@Injectable({ providedIn: 'root' })
export class UnauthenticatedGuard implements CanActivate {
  protected authenticateService: AuthenticateService = inject(AuthenticateService);
  protected location: Location = inject(WA_LOCATION);
  protected router: Router = inject(Router);
  protected domain: EbbDomain = inject(EbbDomain);

  canActivate(): boolean | UrlTree {
    if (this.authenticateService.isLoggedIn) {
      const urlParams = new URLSearchParams(this.location.search);
      const continueUrl = urlParams.get('continue');
      this.location.href = continueUrl ?? this.domain.getUrl(DOMAIN_COMPONENTS.MY_ACCOUNT_SITE);
      return false;
    }
    return true;
  }
}

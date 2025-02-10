import { Inject, Injectable } from '@angular/core';
import { WA_LOCATION } from '@ng-web-apis/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cookies } from './cookies';
import { DOMAIN_NAME_COMPONENTS, DomainName } from './domain-name';

@Injectable({ providedIn: 'root' })
export class Authenticate {
  private readonly accessTokenKey = 'token';
  private readonly refreshTokenKey = 'refreshToken';

  private isLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    protected cookie: Cookies,
    protected domainName: DomainName,
    @Inject(WA_LOCATION) protected location: Location
  ) {
    this.isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn);
    // this.fetchUserBasicInfo();
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get accessToken(): string | null {
    return this.cookie.get(this.accessTokenKey);
  }

  get refreshToken(): string | null {
    return this.cookie.get(this.refreshTokenKey);
  }

  logout(): void {
    this.cookie.delete(this.accessTokenKey, '/', `.${this.domainName.RootDomain}`);
    this.cookie.delete(this.refreshTokenKey, '/', `.${this.domainName.RootDomain}`);
    this.isLoggedIn$.next(false);
    this.location.href =
      this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.ACCOUNTS_SITE) +
      `/?continue=${this.location.href}`;
    // TODO: call to logout api for revoke session
  }

  get isLoggedIn(): boolean {
    console.debug('Checking is logged in', {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      isLoggedIn: !!this.accessToken && !!this.refreshToken,
    });
    return !!this.accessToken && !!this.refreshToken;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    const options = { path: '/', domain: `.${this.domainName.RootDomain}` };
    this.cookie.set(this.accessTokenKey, accessToken, options);
    this.cookie.set(this.refreshTokenKey, refreshToken, options);
    this.isLoggedIn$.next(true);
  }
}

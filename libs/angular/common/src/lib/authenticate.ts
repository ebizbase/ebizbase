import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IMeBasicInfoResponse, IRefreshTokenResponse } from '@ebizbase/iam-interfaces';
import { WA_LOCATION } from '@ng-web-apis/common';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
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
    protected http: HttpClient,
    @Inject(WA_LOCATION) protected location: Location
  ) {
    this.isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn);
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get accessToken(): string | null {
    return this.cookie.get(this.accessTokenKey);
  }

  private get refreshToken(): string | null {
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

  getMyInfo(): Observable<IRestfulResponse<IMeBasicInfoResponse>> {
    const url = `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/me`;
    return this.http.get(url).pipe();
  }

  refreshAccessToken(): Observable<boolean> {
    if (!this.refreshToken) {
      this.logout();
      return of(false);
    }
    const url = `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/authenticate/refresh-token`;
    return this.http
      .post<IRestfulResponse<IRefreshTokenResponse>>(url, { refresToken: this.refreshToken })
      .pipe(
        map(({ data }) => {
          if (!data) {
            return false;
          } else {
            const { accessToken, refreshToken } = data;
            this.setTokens(accessToken, refreshToken);
            return true;
          }
        }),
        catchError((error) => {
          console.error('Failed to refresh access token', error);
          this.logout();
          return of(false);
        })
      );
  }
}

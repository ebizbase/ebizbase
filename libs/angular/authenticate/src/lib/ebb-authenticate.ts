import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EbbCookie } from '@ebizbase/angular-cookie';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IRefreshTokenResponse } from '@ebizbase/iam-interfaces';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EbbAuthenticate {
  private readonly accessTokenKey = 'actk';
  private readonly refreshTokenKey = 'rftk';

  private isLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    protected cookie: EbbCookie,
    protected domain: EbbDomain,
    protected http: HttpClient
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
    this.cookie.delete(this.accessTokenKey, '/');
    this.cookie.delete(this.refreshTokenKey, '/');
    this.isLoggedIn$.next(false);
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
    const options = { path: '/', domain: `.${this.domain.RootDomain}` };
    this.cookie.set(this.accessTokenKey, accessToken, options);
    this.cookie.set(this.refreshTokenKey, refreshToken, options);
    this.isLoggedIn$.next(true);
  }

  refreshAccessToken(): Observable<boolean> {
    if (!this.refreshToken) {
      this.logout();
      return of(false);
    }
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/authenticate/refresh-token`;
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IRefreshTokenResponse } from '@ebizbase/iam-interfaces';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { CookieService } from './cookie.service';
import { SystemUrl } from './system-url.service';

@Injectable({ providedIn: 'root' })
export class AuthenticateService {
  private readonly accessTokenKey = 'actk';
  private readonly refreshTokenKey = 'rftk';

  private isLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    protected cookieService: CookieService,
    protected systemUrl: SystemUrl,
    protected http: HttpClient
  ) {
    this.isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn);
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get accessToken(): string | null {
    return this.cookieService.get(this.accessTokenKey);
  }

  private get refreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey);
  }

  logout(): void {
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
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
    const domain = this.systemUrl.HomeSiteDomain || window.location.hostname;
    const options = { path: '/', domain: `.${domain}` };
    this.cookieService.set(this.accessTokenKey, accessToken, options);
    this.cookieService.set(this.refreshTokenKey, refreshToken, options);
    this.isLoggedIn$.next(true);
  }

  refreshAccessToken(): Observable<boolean> {
    if (!this.refreshToken) {
      this.logout();
      return of(false);
    }
    const url = `${this.systemUrl.IamServiceBaseURL}/authenticate/refresh-token`;
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

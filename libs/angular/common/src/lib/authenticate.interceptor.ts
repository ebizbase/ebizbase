import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Authenticate } from './authenticate';
import { DOMAIN_NAME_COMPONENTS, DomainName } from './domain-name';
import { EcommaSite } from './ecomma-site';

@Injectable()
export class AuthenticateInterceptor implements HttpInterceptor {
  private isRefreshing: BehaviorSubject<null | true> = new BehaviorSubject<null | true>(null);

  constructor(
    private domainName: DomainName,
    private authenticate: Authenticate,
    private ecommaSite: EcommaSite
  ) {
    console.log('AuthenticateInterceptor', 'created');
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    req = this.addLanguageToRequest(req);

    if (
      !this.authenticate.isLoggedIn ||
      !new URL(req.url).host.endsWith(this.domainName.RootDomain)
    ) {
      return next.handle(req);
    }

    // Clone the request to add the Authorization header if the access token exists
    req = this.addTokenToRequest(req);
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing.value) {
      this.isRefreshing.next(true);

      if (this.authenticate.isLoggedIn) {
        return new Observable((observer) => {
          this.refreshToken()
            .then(() => {
              this.isRefreshing.next(null);
              observer.next();
              observer.complete();
            })
            .catch(() => {
              this.isRefreshing.next(null);
              this.authenticate.logout();
            });
        }).pipe(switchMap(() => next.handle(this.addTokenToRequest(request))));
      }
    }

    return this.isRefreshing.pipe(
      filter((status) => status === null),
      take(1),
      switchMap(() => next.handle(this.addTokenToRequest(request)))
    );
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch(
      `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/authenticate/refresh-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refreshToken: this.authenticate.refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    const data = await response.json();
    if (data.data?.accessToken && data.data.refreshToken) {
      this.authenticate.setTokens(data.data.accessToken, data.data.refreshToken);
    }
  }

  private addTokenToRequest(request: HttpRequest<unknown>) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${this.authenticate.accessToken}` },
    });
  }

  private addLanguageToRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({ setHeaders: { 'Accept-Language': this.ecommaSite.language() } });
  }
}

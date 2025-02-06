import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EbbDomain } from '@ebizbase/angular-domain';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { EbbAuthenticate } from './ebb-authenticate';

@Injectable({ providedIn: 'root' })
export class EbbAPIAuthenticateInterceptor implements HttpInterceptor {
  constructor(
    private authenticate: EbbAuthenticate,
    private domain: EbbDomain
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (new URL(req.url).host.endsWith(this.domain.RootDomain)) {
      // Clone the request to add the Authorization header if the access token exists
      const accessToken = this.authenticate.accessToken;
      const clonedRequest = accessToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;

      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // If the error is 401, try to refresh the token
          if (error.status === 401) {
            return this.authenticate.refreshAccessToken().pipe(
              switchMap((success) => {
                if (success) {
                  // Retry the original request with the new token
                  const newAccessToken = this.authenticate.accessToken;
                  const retryRequest = req.clone({
                    setHeaders: { Authorization: `Bearer ${newAccessToken}` },
                  });
                  return next.handle(retryRequest);
                }
                // Logout if refresh token fails
                this.authenticate.logout();
                return throwError(() => error);
              }),
              catchError((refreshError) => {
                console.error('Refresh token failed', refreshError);
                this.authenticate.logout();
                return throwError(() => error);
              })
            );
          }

          // If the error is not 401, propagate it
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}

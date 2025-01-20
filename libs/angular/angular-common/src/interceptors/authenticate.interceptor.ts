import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticateService, SystemUrl } from '../services';

@Injectable()
export class AuthenticateInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticateService,
    private systemUrl: SystemUrl
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.endsWith(this.systemUrl.HomeSiteDomain)) {
      return next.handle(req);
    }

    // Clone the request to add the Authorization header if the access token exists
    const accessToken = this.authService.accessToken;
    const clonedRequest = accessToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the error is 401, try to refresh the token
        if (error.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            switchMap((success) => {
              if (success) {
                // Retry the original request with the new token
                const newAccessToken = this.authService.accessToken;
                const retryRequest = req.clone({
                  setHeaders: { Authorization: `Bearer ${newAccessToken}` },
                });
                return next.handle(retryRequest);
              }
              // Logout if refresh token fails
              this.authService.logout();
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              console.error('Refresh token failed', refreshError);
              this.authService.logout();
              return throwError(() => error);
            })
          );
        }

        // If the error is not 401, propagate it
        return throwError(() => error);
      })
    );
  }
}

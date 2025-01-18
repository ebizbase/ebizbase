import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateService, DomainService } from '@ebizbase/angular-common-service';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IGetOtpRequest, IVerifyRequest, IVerifyResponse } from '@ebizbase/iam-interfaces';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IamService {
  constructor(
    private authenticate: AuthenticateService,
    private domain: DomainService,
    private http: HttpClient
  ) {}

  getOtp({ email }: IGetOtpRequest): Observable<IRestfulResponse> {
    const url = `${this.domain.IamServiceBaseURL}/authenticate`;
    return this.http.patch(url, { email }).pipe();
  }

  verifyOtp(data: IVerifyRequest): Observable<IRestfulResponse<IVerifyResponse>> {
    const url = `${this.domain.IamServiceBaseURL}/authenticate`;
    return this.http.post<IRestfulResponse<IVerifyResponse>>(url, data).pipe(
      map(({ data, ...rest }) => ({
        ...rest,
        data: {
          ...data,
          accessTokenExpiresAt: new Date(data.accessTokenExpiresAt),
          refreshTokenExpiresAt: new Date(data.refreshTokenExpiresAt),
        },
      })),
      tap(({ data }) => {
        console.log(data);
        this.authenticate.setTokens(
          data.accessToken,
          data.accessTokenExpiresAt,
          data.refreshToken,
          data.refreshTokenExpiresAt
        );
      })
    );
  }
}

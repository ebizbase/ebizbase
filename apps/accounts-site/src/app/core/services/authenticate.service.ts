import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authenticate, DOMAIN_NAME_COMPONENTS, DomainName } from '@ebizbase/angular-common';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IGetOtpRequest, IVerifyRequest, IVerifyResponse } from '@ebizbase/iam-interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class APIService {
  constructor(
    private http: HttpClient,
    protected authenticate: Authenticate,
    protected domainName: DomainName
  ) {}
  getOtp(data: IGetOtpRequest): Observable<IRestfulResponse> {
    const url = `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/authenticate/get-otp`;
    return this.http.post(url, data).pipe();
  }

  verify(data: IVerifyRequest): Observable<IRestfulResponse<IVerifyResponse>> {
    const url = `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/authenticate/verify`;
    return this.http.post<IRestfulResponse<IVerifyResponse>>(url, data).pipe(
      tap(({ data }) => {
        this.authenticate.setTokens(data.accessToken, data.refreshToken);
      })
    );
  }
}

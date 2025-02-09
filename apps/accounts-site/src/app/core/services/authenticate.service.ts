import { Injectable } from '@angular/core';
import { EbbAuthenticate } from '@ebizbase/angular-authenticate';
import { DOMAIN_COMPONENTS } from '@ebizbase/angular-domain';
import { IRestfulResponse } from '@ebizbase/common-types';
import { IGetOtpRequest, IVerifyRequest, IVerifyResponse } from '@ebizbase/iam-interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticateService extends EbbAuthenticate {
  getOtp({ email }: IGetOtpRequest): Observable<IRestfulResponse> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/authenticate/get-otp`;
    return this.http.post(url, { email }).pipe();
  }

  verify(data: IVerifyRequest): Observable<IRestfulResponse<IVerifyResponse>> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/authenticate/verify`;
    return this.http.post<IRestfulResponse<IVerifyResponse>>(url, data).pipe(
      tap(({ data }) => {
        this.setTokens(data.accessToken, data.refreshToken);
      })
    );
  }
}

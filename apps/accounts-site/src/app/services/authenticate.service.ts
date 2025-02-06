import { Injectable } from '@angular/core';
import { EbbAuthenticate } from '@ebizbase/angular-authenticate';
import { DOMAIN_COMPONENTS } from '@ebizbase/angular-domain';
import { IRestfulResponse } from '@ebizbase/common-types';
import {
  IGetOtpRequest,
  IMeRequest,
  IMeResponse,
  IVerifyHotpRequest,
  IVerifyHotpResponse,
} from '@ebizbase/iam-interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService extends EbbAuthenticate {
  getMyInfo(): Observable<IRestfulResponse<IMeResponse>> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/me`;
    return this.http.get(url).pipe();
  }

  updateMyInfo(data: IMeRequest): Observable<IRestfulResponse<IMeResponse>> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/me`;
    return this.http.patch(url, data).pipe();
  }

  getOtp({ email }: IGetOtpRequest): Observable<IRestfulResponse> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/authenticate/get-otp`;
    return this.http.post(url, { email }).pipe();
  }

  verifyHotp(data: IVerifyHotpRequest): Observable<IRestfulResponse<IVerifyHotpResponse>> {
    const url = `${this.domain.getUrl(DOMAIN_COMPONENTS.IAM_SERVICE)}/authenticate/verify-hotp`;
    return this.http.post<IRestfulResponse<IVerifyHotpResponse>>(url, data).pipe(
      tap(({ data }) => {
        this.setTokens(data.accessToken, data.refreshToken);
      })
    );
  }
}

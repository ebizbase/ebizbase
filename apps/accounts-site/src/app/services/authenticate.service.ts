import { Injectable } from '@angular/core';
import { AuthenticateService as BaseAuthenticateService } from '@ebizbase/angular-common';
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
export class AuthenticateService extends BaseAuthenticateService {
  getMyInfo(): Observable<IRestfulResponse<IMeResponse>> {
    const url = `${this.systemUrl.IamServiceBaseURL}/me`;
    return this.http.get(url).pipe();
  }

  updateMyInfo(data: IMeRequest): Observable<IRestfulResponse<IMeResponse>> {
    const url = `${this.systemUrl.IamServiceBaseURL}/me`;
    return this.http.patch(url, data).pipe();
  }

  getOtp({ email }: IGetOtpRequest): Observable<IRestfulResponse> {
    const url = `${this.systemUrl.IamServiceBaseURL}/authenticate/get-otp`;
    return this.http.post(url, { email }).pipe();
  }

  verifyHotp(data: IVerifyHotpRequest): Observable<IRestfulResponse<IVerifyHotpResponse>> {
    const url = `${this.systemUrl.IamServiceBaseURL}/authenticate/verify-hotp`;
    return this.http.post<IRestfulResponse<IVerifyHotpResponse>>(url, data).pipe(
      tap(({ data }) => {
        console.log(data);
        this.setTokens(data.accessToken, data.refreshToken);
      })
    );
  }
}

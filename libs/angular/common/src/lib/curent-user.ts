import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IRestfulResponse, Nullable } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { WA_LOCATION } from '@ng-web-apis/common';
import { BehaviorSubject } from 'rxjs';
import { Authenticate } from './authenticate';
import { DOMAIN_NAME_COMPONENTS, DomainName } from './domain-name';

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  public basicInfo$ = new BehaviorSubject<Nullable<IMeBasicInfoResponse>>(null);

  constructor(
    private http: HttpClient,
    private domainName: DomainName,
    private authenticate: Authenticate,
    @Inject(WA_LOCATION) protected location: Location
  ) {
    this.fetchBasicInfo();
  }

  public fetchBasicInfo() {
    console.log('Featch user basic info');
    if (!this.authenticate.isLoggedIn) {
      return;
    }
    const url = `${this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)}/me`;
    this.http
      .get<IRestfulResponse<IMeBasicInfoResponse>>(url)
      .pipe()
      .subscribe({
        next: ({ data }) => {
          this.basicInfo$.next(data as IMeBasicInfoResponse);
        },
      });
  }
}

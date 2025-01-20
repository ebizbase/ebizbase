import { isPlatformServer } from '@angular/common';
import {
  Inject,
  Injectable,
  makeStateKey,
  Optional,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { WA_LOCATION } from '@ng-web-apis/common';

const domainStateKey = makeStateKey<string>('DOMAIN');

@Injectable({ providedIn: 'root' })
export class SystemUrl {
  public readonly Protocol: string;

  public readonly HomeSiteDomain: string;
  public readonly HomeSiteBaseURL: string;

  public readonly AccountsSiteDomain: string;
  public readonly AccountsSiteBaseURL: string;

  public readonly AssetsDomain: string;
  public readonly AssetsBaseURL: string;

  public readonly IamServiceDomain: string;
  public readonly IamServiceBaseURL: string;

  public readonly IconsDomain: string;
  public readonly IconsBaseURL: string;

  constructor(
    private transferState: TransferState,
    @Inject(WA_LOCATION) private location: Location,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject('DOMAIN') private domainEnviroment: string
  ) {
    if (isPlatformServer(this.platformId)) {
      this.HomeSiteDomain = this.domainEnviroment;
      this.transferState.set(domainStateKey, this.HomeSiteDomain);
    } else {
      this.HomeSiteDomain = this.transferState.get(domainStateKey, '');
    }
    this.Protocol = this.location.protocol;

    this.HomeSiteBaseURL = this.Protocol + '//' + this.HomeSiteDomain;

    this.IamServiceDomain = 'iam-service.' + this.HomeSiteDomain;
    this.IamServiceBaseURL = this.Protocol + '//' + this.IamServiceDomain;

    this.AssetsDomain = 'assets.' + this.HomeSiteDomain;
    this.AssetsBaseURL = this.Protocol + '//' + this.AssetsDomain;

    this.IconsDomain = 'icons.' + this.HomeSiteDomain;
    this.IconsBaseURL = this.Protocol + '//' + this.IconsDomain;

    this.AccountsSiteDomain = 'accounts.' + this.HomeSiteDomain;
    this.AccountsSiteBaseURL = this.Protocol + '//' + this.AccountsSiteDomain;
  }
}

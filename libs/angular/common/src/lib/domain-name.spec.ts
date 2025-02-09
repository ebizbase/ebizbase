import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { WA_LOCATION } from '@ng-web-apis/common';
import { DOMAIN_NAME_COMPONENTS, DomainName, IS_HOME_SITE } from './domain-name';

describe('DomainName', () => {
  let service: DomainName;
  let locationMock: Location;

  beforeEach(() => {
    locationMock = { protocol: 'https:', host: 'sub.domain.com' } as unknown as Location;
  });

  it('should create the service', () => {
    TestBed.configureTestingModule({
      providers: [
        DomainName,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(DomainName);
    expect(service).toBeTruthy();
  });

  it('should set Protocol correctly', () => {
    TestBed.configureTestingModule({
      providers: [
        DomainName,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(DomainName);
    expect(service.Protocol).toBe('https');
  });

  it('should set RootDomain correctly when IS_HOME_SITE is true', () => {
    TestBed.configureTestingModule({
      providers: [
        DomainName,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(DomainName);
    expect(service.RootDomain).toBe('sub.domain.com');
  });

  it('should set RootDomain correctly when IS_HOME_SITE is false', () => {
    TestBed.configureTestingModule({
      providers: [
        DomainName,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: false },
      ],
    });
    service = TestBed.inject(DomainName);
    expect(service.RootDomain).toBe('domain.com');
  });

  it('should return the correct URL from getUrl()', () => {
    TestBed.configureTestingModule({
      providers: [
        DomainName,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(DomainName);
    expect(service.getUrl(DOMAIN_NAME_COMPONENTS.HOME_SITE)).toBe('https://sub.domain.com');
    expect(service.getUrl(DOMAIN_NAME_COMPONENTS.ACCOUNTS_SITE)).toBe(
      'https://accounts.sub.domain.com'
    );
    expect(service.getUrl(DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE)).toBe(
      'https://my-account.sub.domain.com'
    );
    expect(service.getUrl(DOMAIN_NAME_COMPONENTS.IAM_SERVICE)).toBe(
      'https://iam-service.sub.domain.com'
    );
  });
});

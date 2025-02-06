import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { WA_LOCATION } from '@ng-web-apis/common';
import { EbbDomain, IS_HOME_SITE } from './ebb-domain';

describe('EbbDomain', () => {
  let service: EbbDomain;
  let locationMock: Location;

  beforeEach(() => {
    locationMock = { protocol: 'https:', host: 'sub.domain.com' } as unknown as Location;
  });

  it('should create the service', () => {
    TestBed.configureTestingModule({
      providers: [
        EbbDomain,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(EbbDomain);
    expect(service).toBeTruthy();
  });

  it('should set Protocol correctly', () => {
    TestBed.configureTestingModule({
      providers: [
        EbbDomain,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(EbbDomain);
    expect(service.Protocol).toBe('https');
  });

  it('should set RootDomain correctly when IS_HOME_SITE is true', () => {
    TestBed.configureTestingModule({
      providers: [
        EbbDomain,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(EbbDomain);
    expect(service.RootDomain).toBe('sub.domain.com');
  });

  it('should set RootDomain correctly when IS_HOME_SITE is false', () => {
    TestBed.configureTestingModule({
      providers: [
        EbbDomain,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: false },
      ],
    });

    service = TestBed.inject(EbbDomain);
    expect(service.RootDomain).toBe('domain.com');
  });

  it('should return the correct URL from getUrl()', () => {
    TestBed.configureTestingModule({
      providers: [
        EbbDomain,
        { provide: WA_LOCATION, useValue: locationMock },
        { provide: IS_HOME_SITE, useValue: true },
      ],
    });

    service = TestBed.inject(EbbDomain);
    const component = 'app';
    const expectedUrl = 'https://app.sub.domain.com';
    expect(service.getUrl(component)).toBe(expectedUrl);
  });
});

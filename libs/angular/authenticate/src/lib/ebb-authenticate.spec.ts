import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EbbCookie } from '@ebizbase/angular-cookie';
import { EbbDomain } from '@ebizbase/angular-domain';
import { EbbAuthenticate } from './ebb-authenticate';

describe('EbbAuthenticate', () => {
  let service: EbbAuthenticate;
  let cookieMock: jest.Mocked<EbbCookie>;
  let domainMock: jest.Mocked<EbbDomain>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    cookieMock = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EbbCookie>;

    domainMock = {
      RootDomain: 'example.com',
      getUrl: jest.fn().mockReturnValue('https://api.example.com'),
    } as unknown as jest.Mocked<EbbDomain>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EbbCookie, useValue: cookieMock },
        { provide: EbbDomain, useValue: domainMock },
        EbbAuthenticate,
      ],
    });

    service = TestBed.inject(EbbAuthenticate);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return access token from cookie', () => {
    cookieMock.get.mockReturnValue('test-access-token');
    expect(service.accessToken).toBe('test-access-token');
  });

  it('should return isLoggedIn as true if both tokens exist', () => {
    cookieMock.get.mockImplementation((key) => (key === 'actk' ? 'token' : 'refreshToken'));
    expect(service.isLoggedIn).toBe(true);
  });

  it('should return isLoggedIn as false if tokens are missing', () => {
    cookieMock.get.mockReturnValue('');
    expect(service.isLoggedIn).toBe(false);
  });

  it('should set tokens correctly', () => {
    service.setTokens('new-access-token', 'new-refresh-token');
    expect(cookieMock.set).toHaveBeenCalledWith('actk', 'new-access-token', {
      path: '/',
      domain: '.example.com',
    });
    expect(cookieMock.set).toHaveBeenCalledWith('rftk', 'new-refresh-token', {
      path: '/',
      domain: '.example.com',
    });
  });

  it('should delete tokens on logout', () => {
    service.logout();
    expect(cookieMock.delete).toHaveBeenCalledWith('actk', '/');
    expect(cookieMock.delete).toHaveBeenCalledWith('rftk', '/');
  });

  it('should refresh access token successfully', () => {
    cookieMock.get.mockReturnValue('valid-refresh-token');
    const mockResponse = {
      data: { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' },
    };

    service.refreshAccessToken().subscribe((result) => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('https://api.example.com/authenticate/refresh-token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout if refresh token is missing', () => {
    cookieMock.get.mockReturnValue('');
    const logoutSpy = jest.spyOn(service, 'logout');

    service.refreshAccessToken().subscribe((result) => {
      expect(result).toBe(false);
    });
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should logout on refresh token error', () => {
    cookieMock.get.mockReturnValue('invalid-refresh-token');
    const logoutSpy = jest.spyOn(service, 'logout');

    service.refreshAccessToken().subscribe((result) => {
      expect(result).toBe(false);
    });

    const req = httpMock.expectOne('https://api.example.com/authenticate/refresh-token');
    req.flush('Invalid token', { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
  });
});

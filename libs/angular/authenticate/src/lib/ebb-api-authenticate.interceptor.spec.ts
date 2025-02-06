import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EbbDomain } from '@ebizbase/angular-domain';
import { of, throwError } from 'rxjs';
import { EbbAPIAuthenticateInterceptor } from './ebb-api-authenticate.interceptor';
import { EbbAuthenticate } from './ebb-authenticate';

describe('EbbAPIAuthenticateInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authenticate: jest.Mocked<EbbAuthenticate>;
  let domain: jest.Mocked<EbbDomain>;

  beforeEach(() => {
    authenticate = {
      accessToken: 'test-access-token',
      refreshAccessToken: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<EbbAuthenticate>;

    domain = { RootDomain: 'example.com' } as jest.Mocked<EbbDomain>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EbbAuthenticate, useValue: authenticate },
        { provide: EbbDomain, useValue: domain },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: EbbAPIAuthenticateInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token exists', () => {
    httpClient.get('https://api.example.com/test').subscribe();
    const req = httpMock.expectOne('https://api.example.com/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-access-token');
  });

  it('should not add Authorization header if token does not exist', () => {
    Object.defineProperty(authenticate, 'accessToken', { value: '' });
    httpClient.get('https://api.example.com/test').subscribe();
    const req = httpMock.expectOne('https://api.example.com/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('should refresh token on 401 response and retry request', () => {
    authenticate.refreshAccessToken.mockReturnValue(of(true));
    Object.defineProperty(authenticate, 'accessToken', { value: 'new-access-token' });
    httpClient.get('https://api.example.com/test').subscribe();

    const req1 = httpMock.expectOne('https://api.example.com/test');
    req1.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authenticate.refreshAccessToken).toHaveBeenCalled();

    const req2 = httpMock.expectOne('https://api.example.com/test');
    expect(req2.request.headers.get('Authorization')).toBe('Bearer new-access-token');
  });

  it('should logout on failed token refresh', () => {
    authenticate.refreshAccessToken.mockReturnValue(throwError(() => new Error('Refresh failed')));

    httpClient.get('https://api.example.com/test').subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
      },
    });

    const req1 = httpMock.expectOne('https://api.example.com/test');
    req1.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authenticate.refreshAccessToken).toHaveBeenCalled();
    expect(authenticate.logout).toHaveBeenCalled();
  });
});

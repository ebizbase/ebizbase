import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Request } from 'express';
import { Cookies } from './cookies';

describe('CookieService', () => {
  let service: Cookies;
  let documentMock: Partial<Document>;
  let requestMock: Partial<Request>;

  beforeEach(() => {
    documentMock = {
      cookie: '',
    };

    requestMock = {
      headers: {
        cookie: 'testCookie=value',
      },
    };

    TestBed.configureTestingModule({
      providers: [
        Cookies,
        { provide: DOCUMENT, useValue: documentMock },
        { provide: PLATFORM_ID, useValue: 'browser' }, // Thay 'server' nếu cần test server-side
        { provide: 'REQUEST', useValue: requestMock },
      ],
    });

    service = TestBed.inject(Cookies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a cookie', () => {
    service.set('test', '123');
    expect(documentMock.cookie).toContain('test=123');
  });

  it('should get a cookie', () => {
    documentMock.cookie = 'test=123';
    expect(service.get('test')).toBe('123');
  });

  it('should return an empty string for non-existing cookie', () => {
    documentMock.cookie = '';
    expect(service.get('nonexistent')).toBe('');
  });

  it('should check if a cookie exists', () => {
    documentMock.cookie = 'exists=true';
    expect(service.check('exists')).toBe(true);
    expect(service.check('missing')).toBe(false);
  });

  it('should get all cookies', () => {
    documentMock.cookie = 'cookie1=abc; cookie2=xyz';
    expect(service.getAll()).toEqual({ cookie1: 'abc', cookie2: 'xyz' });
  });

  it('should delete a cookie', () => {
    documentMock.cookie = 'deleteMe=123';
    service.delete('deleteMe');
    expect(documentMock.cookie).not.toContain('deleteMe=123');
  });

  it('should delete all cookies', () => {
    documentMock.cookie = 'cookieA=1; cookieB=2';
    service.deleteAll();
    expect(documentMock.cookie).not.toContain('cookieA=1');
    expect(documentMock.cookie).not.toContain('cookieB=2');
  });
});

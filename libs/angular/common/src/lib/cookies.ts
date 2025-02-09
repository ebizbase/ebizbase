import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Dict } from '@ebizbase/common-types';
import { Request } from 'express';

@Injectable({ providedIn: 'root' })
export class Cookies {
  private readonly documentIsAccessible: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject('REQUEST') private request: Request
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  /**
   * Get cookie Regular Expression
   *
   * @param name Cookie name
   * @returns property RegExp
   */
  static getCookieRegExp(name: string): RegExp {
    // eslint-disable-next-line no-useless-escape
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }

  /**
   * Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI).
   *
   * @param encodedURIComponent A value representing an encoded URI component.
   *
   * @returns The unencoded version of an encoded component of a Uniform Resource Identifier (URI).
   */
  static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }

  /**
   * Return `true` if {@link Document} is accessible, otherwise return `false`
   *
   * @param name Cookie name
   * @returns boolean - whether cookie with specified name exists
   */
  check(name: string): boolean {
    name = encodeURIComponent(name);
    const cookie = this.documentIsAccessible ? this.document.cookie : this.request?.headers.cookie;
    if (!cookie) {
      return false;
    }
    const regExp: RegExp = Cookies.getCookieRegExp(name);
    return regExp.test(cookie);
  }

  /**
   * Get cookies by name
   *
   * @param name Cookie name
   * @returns property value
   */
  get(name: string): string {
    name = encodeURIComponent(name);

    const cookie = this.documentIsAccessible ? this.document.cookie : this.request?.headers.cookie;
    if (!cookie) {
      return '';
    } else {
      const regExp: RegExp = Cookies.getCookieRegExp(name);
      const result: RegExpExecArray | null = regExp.exec(cookie);
      return result && result[1] ? Cookies.safeDecodeURIComponent(result[1]) : '';
    }
  }

  /**
   * Get all cookies in JSON format
   *
   * @returns all the cookies in json
   */
  getAll(): Dict<string> {
    const cookies: { [key: string]: string } = {};
    const cookieString: string | undefined = this.documentIsAccessible
      ? this.document?.cookie
      : this.request?.headers.cookie;

    if (cookieString && cookieString !== '') {
      cookieString.split(';').forEach((currentCookie) => {
        const [cookieName, cookieValue] = currentCookie.split('=');
        cookies[Cookies.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] =
          Cookies.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  /**
   * Set cookie based on provided information
   *
   * Cookie's parameters:
   * <pre>
   * expires  Number of days until the cookies expires or an actual `Date`
   * path     Cookie path
   * domain   Cookie domain
   * secure Cookie secure flag
   * sameSite OWASP same site token `Lax`, `None`, or `Strict`. Defaults to `Lax`
   * </pre>
   *
   * @param name     Cookie name
   * @param value    Cookie value
   * @param options  Body with cookie's params
   */
  set(
    name: string,
    value: string,
    options?: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'None' | 'Strict';
      partitioned?: boolean;
    }
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }

    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    options = options ?? {};

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(
          new Date().getTime() + options.expires * 1000 * 60 * 60 * 24
        );
        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + options.expires.toUTCString() + ';';
      }
    }

    if (options.path) {
      cookieString += 'path=' + options.path + ';';
    }

    if (options.domain) {
      cookieString += 'domain=' + options.domain + ';';
    }

    if (options.secure === false && options.sameSite === 'None') {
      // forced with secure flag because sameSite=None
      options.secure = true;
    }
    if (options.secure) {
      cookieString += 'secure;';
    }

    if (!options.sameSite) {
      options.sameSite = 'Lax';
    }

    cookieString += 'sameSite=' + options.sameSite + ';';

    if (options.partitioned) {
      cookieString += 'Partitioned;';
    }

    this.document.cookie = cookieString;
  }

  /**
   * Delete cookie by name
   *
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   * @param secure Cookie secure flag
   * @param sameSite Cookie sameSite flag - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   */
  delete(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.set(name, '', { expires: expiresDate, path, domain, secure, sameSite });
  }

  /**
   * Delete all cookies
   *
   * @param path   Cookie path
   * @param domain Cookie domain
   * @param secure Is the Cookie secure
   * @param sameSite Is the cookie same site
   */
  deleteAll(
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }

    const cookies: Dict<string> = this.getAll();

    for (const cookieName in cookies) {
      // eslint-disable-next-line no-prototype-builtins
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }
}

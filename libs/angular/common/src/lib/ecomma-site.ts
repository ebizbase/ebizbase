import { isPlatformBrowser } from '@angular/common';
import {
  effect,
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WA_WINDOW } from '@ng-web-apis/common';
import { Observable, Subscription } from 'rxjs';
import { Cookies } from './cookies';
import { DomainName } from './domain-name';

@Injectable({ providedIn: 'root' })
export class EcommaSite implements OnDestroy {
  private readonly colorModeKey = 'colorMode';

  // color mode
  private _systemColorSchemeSubscription = new Subscription();
  private _colorMode: WritableSignal<'dark' | 'light' | 'monochrome' | 'system'>;
  private _isDarkMode = signal<boolean>(false);
  private _isMonochromeMode = signal<boolean>(false);

  // General page config
  public language = signal('en');
  public metas = signal<Record<string, string>>({});

  constructor(
    @Inject(PLATFORM_ID) protected platformId: object,
    @Inject(WA_WINDOW) private window: Window,
    private cookies: Cookies,
    private domainName: DomainName,
    private titleService: Title
  ) {
    const colorMode = this.cookies.get(this.colorModeKey);
    if (
      colorMode !== 'dark' &&
      colorMode !== 'light' &&
      colorMode !== 'monochrome' &&
      colorMode !== 'system'
    ) {
      this._colorMode = signal('system');
    } else {
      this._colorMode = signal(colorMode);
    }

    effect(() => {
      this.window.document.documentElement.lang = this.language();
    });

    effect(() => {
      this.window.document
        .querySelectorAll('meta[managed="true"]') // get all managed meta tags
        .forEach((currentMeta) => {
          const currentName = currentMeta.getAttribute('name');
          if (currentName === null || this.metas()[currentName] === currentName) {
            currentMeta.remove();
          }
        });

      Object.entries(this.metas()).forEach(([name, content]) => {
        let meta = this.window.document.querySelector(`meta[name="${name}"][managed="true"]`);
        if (meta === null) {
          meta = this.window.document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          meta.setAttribute('managed', 'true');
          this.window.document.head.appendChild(meta);
        } else {
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          meta.setAttribute('managed', 'true');
        }
      });
    });

    effect(() => {
      if (this._colorMode() === 'system') {
        this._systemColorSchemeSubscription.add(
          this.isDarkModeObserverable() //
            .subscribe((isDarkMode: boolean) => {
              this._isDarkMode.set(isDarkMode);
            })
        );
      } else {
        this._isDarkMode.set(this._colorMode() === 'dark');
        this._systemColorSchemeSubscription.unsubscribe();
      }
      this._isMonochromeMode.set(this._colorMode() === 'monochrome');
      this.cookies.set(this.colorModeKey, this._colorMode(), {
        path: '/',
        domain: `.${this.domainName.RootDomain}`,
      });
    });
  }

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  public set colorMode(mode: 'dark' | 'light' | 'monochrome' | 'system') {
    this._colorMode.set(mode);
  }

  public get colorMode() {
    return this._colorMode();
  }

  public get isDarkMode() {
    return this._isDarkMode();
  }

  public get isMonochromeMode() {
    return this._isMonochromeMode();
  }

  public get title() {
    return this.titleService.getTitle();
  }

  public set title(title: string) {
    this.titleService.setTitle(title);
  }

  private isDarkModeObserverable(signal?: AbortSignal): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      function emitValue(event: Event) {
        subscriber.next((event as MediaQueryListEvent).matches);
      }

      const mediaListQuery = this.window.matchMedia('(prefers-color-scheme: dark)');

      if (signal) {
        signal.onabort = () => {
          mediaListQuery.removeEventListener('change', emitValue);
          if (!subscriber.closed) {
            subscriber.complete();
          }
        };
      }

      mediaListQuery.addEventListener('change', emitValue);
      subscriber.next(mediaListQuery.matches);

      return () => {
        mediaListQuery.removeEventListener('change', emitValue);
        if (!subscriber.closed) {
          subscriber.complete();
        }
      };
    });
  }

  ngOnDestroy(): void {
    this._systemColorSchemeSubscription.unsubscribe();
  }
}

import { effect, Inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WA_WINDOW } from '@ng-web-apis/common';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EbbSiteService implements OnDestroy {
  // color mode
  private _systemColorSchemeSubscription = new Subscription();
  private _colorMode = signal<'dark' | 'light' | 'monochrome' | 'system'>('system');
  private _isDarkMode = signal<boolean>(false);
  private _isMonochromeMode = signal<boolean>(false);

  // General page config
  public _language = signal('en');
  public _metas = signal<Record<string, string>>({});

  constructor(
    @Inject(WA_WINDOW) private window: Window,
    private titleService: Title
  ) {
    effect(() => {
      this.window.document.documentElement.lang = this._language();
    });

    effect(() => {
      this.window.document
        .querySelectorAll('meta[managed="true"]') // get all managed meta tags
        .forEach((currentMeta) => {
          const currentName = currentMeta.getAttribute('name');
          if (currentName === null || this._metas()[currentName] === currentName) {
            currentMeta.remove();
          }
        });

      Object.entries(this._metas()).forEach(([name, content]) => {
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
      console.log('Site service color mode', {
        mode: this._colorMode(),
        darkMode: this._isDarkMode(),
        monochrome: this._isMonochromeMode(),
      });
    });
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

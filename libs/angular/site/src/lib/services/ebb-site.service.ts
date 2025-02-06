import { effect, Inject, Injectable, OnDestroy, signal } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EbbSiteService implements OnDestroy {
  // color mode
  private _systemColorSchemeSubscription = new Subscription();
  private _colorMode = signal<'dark' | 'light' | 'monochrome' | 'system'>('system');
  private _isDarkMode = signal<boolean>(false);
  private _isMonochromeMode = signal<boolean>(false);

  constructor(@Inject(WA_WINDOW) private window: Window) {
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

  public isDarkMode() {
    return this._isDarkMode();
  }

  public isMonochromeMode() {
    return this._isMonochromeMode();
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

import { effect, Inject, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { WA_WINDOW } from '@ng-web-apis/common';
import { filter, Observable, Subscription } from 'rxjs';
import { MenuItem, SubMenuItem } from '../models/menu.model';
import { PageInfo } from '../models/page-information.model';

@Injectable({
  providedIn: 'root',
})
export class AppLayoutService implements OnDestroy {
  // sidebar menu
  private _navigrationEndSubscription = new Subscription();
  private _mobileMenusOpened = signal(false);
  private _menus = signal<MenuItem[]>([]);

  // color mode
  private _systemColorSchemeSubscription = new Subscription();
  private _colorMode: WritableSignal<'dark' | 'light' | 'monochrome' | 'system'>;
  private _isDarkMode = signal<boolean>(false);
  private _isMonochromeMode = signal<boolean>(false);

  // General page config
  private _info = signal<PageInfo | null>(null);

  constructor(
    @Inject(WA_WINDOW) private window: Window,
    private router: Router,
    private title: Title
  ) {
    this._navigrationEndSubscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd)) // filter only navigation end
        .subscribe(() => {
          this.expandBaseOnActiveRoute();
          this.scrollMainContentToTop();
        })
    );

    // TODO: READ FROM COOKIE
    this._colorMode = signal('light');

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
      console.log('ColorMode', {
        mode: this._colorMode(),
        darkMode: this._isDarkMode(),
        monochrome: this._isMonochromeMode(),
      });
    });
  }

  get menus() {
    return this._menus();
  }

  set menus(menus: MenuItem[]) {
    this._menus.set(menus);
  }

  set info(info: PageInfo | null) {
    this._info.set(info);
    if (info && info.title) {
      this.title.setTitle(info.title);
    }
  }

  get info() {
    return this._info();
  }

  get mobileSidebarOpened() {
    return this._mobileMenusOpened();
  }

  set mobileSidebarOpened(value: boolean) {
    this._mobileMenusOpened.set(value);
  }

  public toggleMobileSidebar() {
    this._mobileMenusOpened.set(!this._mobileMenusOpened());
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
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

  private scrollMainContentToTop() {
    const mainContent = this.window.document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }

  private expandBaseOnActiveRoute() {
    this._menus().forEach((menu) => {
      let activeGroup = false;
      menu.items.forEach((subMenu) => {
        const active = this.isActive(subMenu.route);
        subMenu.expanded = active;
        subMenu.active = active;
        if (active) {
          activeGroup = true;
          this.mobileSidebarOpened = false;
        }
        if (subMenu.children) {
          this.expand(subMenu.children);
        }
      });
      menu.active = activeGroup;
    });
  }

  private expand(items: Array<SubMenuItem>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) {
        this.expand(item.children);
      }
    });
  }

  private isActive(instruction?: string | null): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
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
    this._navigrationEndSubscription.unsubscribe();
    this._systemColorSchemeSubscription.unsubscribe();
  }
}

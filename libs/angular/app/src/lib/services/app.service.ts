import { Inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { WA_WINDOW } from '@ng-web-apis/common';
import { filter, Subscription } from 'rxjs';
import { MenuItem, SubMenuItem } from '../models/menu.model';
import { PageInfo } from '../models/page-information.model';

@Injectable({
  providedIn: 'root',
})
export class EbbAppService implements OnDestroy {
  // sidebar menu
  private _navigrationEndSubscription = new Subscription();
  private _mobileMenusOpened = signal(false);
  private _menus = signal<MenuItem[]>([]);

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
  }

  get menus() {
    return this._menus();
  }

  set menus(menus: MenuItem[]) {
    this._menus.set(menus);
  }

  set pageInfo(info: PageInfo | null) {
    this._info.set(info);
    if (info && info.title) {
      this.title.setTitle(info.title);
    }
  }

  get pageInfo() {
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

  ngOnDestroy(): void {
    this._navigrationEndSubscription.unsubscribe();
  }
}

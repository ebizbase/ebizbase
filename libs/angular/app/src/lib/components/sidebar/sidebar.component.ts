import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { WA_WINDOW } from '@ng-web-apis/common';
import { clsx } from 'clsx';
import { filter, startWith, Subscription } from 'rxjs';
import { SubMenuItem } from '../../models';
import { EbbAppService } from '../../services';
import { SidebarMenu } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'ebb-app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SidebarMenu],
  template: `
    <div class="flex lg:hidden items-center space-x-1 h-14 pl-2">
      <img class="h-5" src="/images/logo.svg" alt="Logo" />
      <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
        >comma</span
      >
      <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
        >Account</span
      >
    </div>
    <ebb-app-sidebar-menu />
  `,
})
export class Sidebar implements OnDestroy {
  private _subscription = new Subscription();

  constructor(
    public app: EbbAppService,
    @Inject(WA_WINDOW) private window: Window,
    private router: Router,
    private cdf: ChangeDetectorRef
  ) {
    this._subscription.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          startWith(this.router)
        ) // filter only navigation end
        .subscribe(() => {
          this.expandBaseOnActiveRoute();
          this.scrollMainContentToTop();
        })
    );
  }

  @HostBinding('class') get classes() {
    return clsx(
      'scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-card scrollbar-thin scrollbar-track-transparent overflow-auto',
      'transition-all duration-300',
      'w-72 px-2 md:px-3 lg:px-4',
      'bg-[var(--tui-background-base)] lg:bg-[var(--tui-background-base-alt)]',
      'fixed left-0 top-0 h-screen lg:h-[calc(100dvh-3.5rem)] flex-col justify-between lg:relative lg:flex -translate-x-full lg:translate-x-0',
      {
        '!translate-x-0 h-[calc(100dvh)]': this.app.mobileSidebarOpened,
      }
    );
  }

  private scrollMainContentToTop() {
    const mainContent = this.window.document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }

  private expandBaseOnActiveRoute() {
    console.log(this.app.menus);
    this.app.menus.forEach((menu) => {
      let activeGroup = false;
      menu.items.forEach((subMenu) => {
        const active = this.isActive(subMenu.route);
        subMenu.expanded = active;
        subMenu.active = active;
        if (active) {
          activeGroup = true;
          this.app.mobileSidebarOpened = false;
        }
        if (subMenu.children) {
          this.expand(subMenu.children);
        }
      });
      menu.active = activeGroup;
    });
    this.cdf.markForCheck();
    console.log(this.app.menus);
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
    this._subscription.unsubscribe();
  }
}

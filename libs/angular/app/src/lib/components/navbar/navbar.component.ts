import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbSiteService } from '@ebizbase/angular-site';
import { TuiButton } from '@taiga-ui/core';
import { EbbAppService } from '../../services';
import { NotificationMenu } from './notification-menu/notification-menu.component';
import { UserMenu } from './user-menu/user-menu.component';

@Component({
  selector: 'ebb-app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, TuiButton, UserMenu, NotificationMenu],
  template: `
    <div class="flex h-16 w-screen items-center bg-[var(--tui-background-base-alt)] px-2 lg:px-4">
      <div class="flex items-center">
        <!-- Open sidebar (only mobile) -->
        <a
          *ngIf="app.menus.length > 0"
          tuiButton
          appearance="flat"
          size="s"
          class="!rounded-full lg:!hidden "
          iconStart="@tui.align-justify"
          tabindex="0"
          (click)="app.toggleMobileSidebar()"
          (key)="app.toggleMobileSidebar()"
          (keydown.enter)="app.toggleMobileSidebar()"
          (keydown.space)="app.toggleMobileSidebar()"
        >
        </a>

        <div class="flex-1 hidden lg:flex space-x-1 items-center">
          <img class="h-5" src="/images/logo.svg" alt="Logo" />
          <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
            >Account</span
          >
        </div>
      </div>
      <div class="flex flex-1 gap-3 justify-end items-center">
        <ebb-app-notification-menu *ngIf="site.isPlatformBrowser" class="hidden" />
        <ebb-app-user-menu *ngIf="site.isPlatformBrowser" />
      </div>
    </div>
  `,
})
export class Navbar {
  constructor(
    protected app: EbbAppService,
    protected site: EbbSiteService
  ) {}
}

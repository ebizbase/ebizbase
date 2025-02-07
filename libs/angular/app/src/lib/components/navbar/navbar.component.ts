import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAssetSrc } from '@ebizbase/angular-asset';
import { TuiButton } from '@taiga-ui/core';
import { EbbAppService } from '../../services';
import { NotificationMenu } from './notification-menu/notification-menu.component';
import { UserMenu } from './user-menu/user-menu.component';

@Component({
  selector: 'ebb-app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, TuiButton, UserMenu, NotificationMenu, EbbAssetSrc],
  template: `
    <div class="flex h-16 w-screen items-center bg-[var(--tui-background-base-alt)] px-2 lg:px-4">
      <div class="flex items-center">
        <!-- Open sidebar (only mobile) -->
        <a
          *ngIf="layoutService.menus.length > 0"
          tuiButton
          appearance="flat"
          size="s"
          class="!rounded-full lg:!hidden "
          iconStart="@tui.align-justify"
          tabindex="0"
          (click)="layoutService.toggleMobileSidebar()"
          (key)="layoutService.toggleMobileSidebar()"
          (keydown.enter)="layoutService.toggleMobileSidebar()"
          (keydown.space)="layoutService.toggleMobileSidebar()"
        >
        </a>

        <div class="flex-1 hidden lg:flex space-x-1 items-center">
          <img class="h-5" [ebbAssetSrc]="'images/logos/wordmark.svg'" alt="Logo" />
          <span class="text-base text-sky-700 font-semibold">Account</span>
        </div>
      </div>
      <div class="flex flex-1 gap-3 justify-end items-center">
        <ebb-app-notification-menu class="hidden" />
        <ebb-app-user-menu />
      </div>
    </div>
  `,
})
export class Navbar {
  constructor(protected layoutService: EbbAppService) {}
}

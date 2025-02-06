import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AssetSrcDirective } from '@ebizbase/angular-common';
import { TuiButton } from '@taiga-ui/core';
import { AppLayoutService } from '../../services';
import { NotificationMenuComponent } from './notification-menu/notification-menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-layout-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, TuiButton, UserMenuComponent, NotificationMenuComponent, AssetSrcDirective],
  template: `
    <div class="flex h-16 w-screen items-center bg-[var(--tui-background-base-alt)] px-2 lg:px-4">
      <div class="flex items-center">
        <!-- Open sidebar (only mobile) -->
        <button
          *ngIf="layoutService.menus.length > 0"
          tuiIconButton
          appearance="flat"
          size="s"
          class="!rounded-full lg:!hidden "
          iconStart="@tui.align-justify"
          (click)="layoutService.toggleMobileSidebar()"
        ></button>

        <div class="flex-1 hidden lg:flex space-x-1 items-center">
          <img class="h-5" [assetSrc]="'images/logos/wordmark.svg'" alt="Logo" />
          <span class="text-base text-sky-700 font-semibold">Account</span>
        </div>
      </div>
      <div class="flex flex-1 gap-3 justify-end items-center">
        <app-layout-notification-menu class="hidden" />
        <app-layout-user-menu />
      </div>
    </div>
  `,
})
export class NavbarComponent {
  constructor(protected layoutService: AppLayoutService) {}
}

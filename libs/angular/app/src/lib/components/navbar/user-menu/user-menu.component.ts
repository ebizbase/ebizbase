import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EbbAuthenticate } from '@ebizbase/angular-authenticate';
import { EbbColorModeSwitcher, EbbSiteService } from '@ebizbase/angular-site';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiDropdown, TuiFallbackSrcPipe, TuiIcon } from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { EbbAppService } from '../../../services';

const LANGUAGES = [
  { code: 'en', title: 'English' },
  { code: 'vn', title: 'Tiếng Việt' },
];

@Component({
  selector: 'ebb-app-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TuiIcon,
    TuiAvatar,
    TuiDropdown,
    TuiDropdownMobile,
    TuiObscured,
    TuiActiveZone,
    TuiFallbackSrcPipe,
    EbbColorModeSwitcher,
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    TuiTextfieldControllerModule,
  ],
  template: `
    <tui-avatar
      [src]="
        'https://avatars.githubusercontent.com/u/11832552' | tuiFallbackSrc: '@tui.user' | async
      "
      class="hover:!bg-[var(--tui-background-neutral-1-hover)] [&>img]:p-1.5"
      (click)="onClick()"
      [tuiDropdown]="userMenu"
      [tuiDropdownManual]="open"
      [tuiObscuredEnabled]="open"
      [tuiDropdownMaxHeight]="600"
      (tuiActiveZoneChange)="onActiveZone($event)"
      (tuiObscured)="onObscured($event)"
    />

    <ng-template #userMenu tuiTheme="light">
      <div class="w-full bg-[var(--tui-background-neutral-1)] p-8 space-y-6">
        <div class="flex items-center space-x-4">
          <tui-avatar
            [src]="
              'https://avatars.githubusercontent.com/u/11832552'
                | tuiFallbackSrc: '@tui.user'
                | async
            "
            size="xl"
          />
          <div>
            <div class="text-3xl">Hi John Doe!</div>
            <div class="pointer-events-none">john.itvn&#64;gmail.com</div>
          </div>
        </div>

        <div
          class="flex h-12 text-sm lg:text-base justify-between w-full border border-[var(--tui-background-neutral-1-hover)] rounded-full bg-[var(--tui-background-neutral-1)]"
        >
          <div
            class="flex flex-1 space-x-2 justify-center items-center border-r border-[var(--tui-background-neutral-1-hover)] hover:bg-[var(--tui-background-neutral-1-hover)] rounded-s-full"
          >
            <tui-icon icon="@tui.user-pen" class="text-sm" />
            <span>Profile</span>
          </div>
          <div
            class="flex flex-1 space-x-2 justify-center items-center hover:bg-[var(--tui-background-neutral-1-hover)] rounded-e-full"
            tabindex="0"
            (click)="onLogout()"
            (keydown.enter)="onLogout()"
            (keydown.space)="onLogout()"
          >
            <tui-icon icon="@tui.log-out" class="text-sm" />
            <span>Logout</span>
          </div>
        </div>

        <ebb-site-color-mode-switcher class="flex w-full h-14" />

        <tui-combo-box
          class="!hidden w-full !rounded-full"
          tuiTextfieldSize="l"
          tuiDropdownMobile
          [tuiTextfieldLabelOutside]="true"
          [stringify]="stringify"
          [formControl]="control"
        >
          <tui-data-list-wrapper
            *tuiDataList
            [itemContent]="stringify | tuiStringifyContent"
            [items]="items | tuiFilterByInput"
          />
        </tui-combo-box>
      </div>
    </ng-template>
  `,
})
export class UserMenu {
  protected open = false;

  constructor(
    public layoutService: EbbAppService,
    public siteService: EbbSiteService,
    public authenticate: EbbAuthenticate
  ) {}

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  protected onChangeColorMode(mode: 'dark' | 'light' | 'monochrome' | 'system') {
    this.siteService.colorMode = mode;
    this.open = false;
  }

  protected getCurrentColorModeIndex() {
    switch (this.siteService.colorMode) {
      case 'light':
        return 0;
      case 'dark':
        return 1;
      case 'monochrome':
        return 2;
      default:
        return 3;
    }
  }

  onLogout() {
    this.authenticate.logout();
  }

  protected readonly control = new FormControl('en');
  protected readonly items = LANGUAGES.map(({ code }) => code);
  protected readonly stringify = (code: string): string =>
    `${LANGUAGES.find((i) => i.code === code)?.title}`;
}

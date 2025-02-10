import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Authenticate,
  ColorModeSwitcher,
  CurrentUser,
  DOMAIN_NAME_COMPONENTS,
  DomainName,
  EcommaSite,
} from '@ebizbase/angular-common';
import { Nullable } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiDropdown, TuiFallbackSrcPipe, TuiIcon } from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiDataListWrapper,
  TuiFade,
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
    ColorModeSwitcher,
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    TuiTextfieldControllerModule,
    TuiFade,
  ],
  template: `
    <tui-avatar
      appearance="accent"
      [src]="basicInfo?.avatar ?? '' | tuiFallbackSrc: '@tui.user' | async"
      size="m"
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
            appearance="accent"
            [src]="basicInfo?.avatar ?? '' | tuiFallbackSrc: '@tui.user' | async"
            size="m"
          />
          <div class="w-screen max-w-52">
            <div tuiFade class="text-xl font-medium">{{ basicInfo?.name }}</div>
            <div tuiFade class="text-sm w-full">{{ basicInfo?.email }}</div>
          </div>
        </div>

        <div
          class="flex h-10 text-sm lg:text-base justify-between w-full border border-[var(--tui-background-neutral-1-hover)] [&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full [&>*:not(:last-child)]:border-r [&>*:hover]:bg-[var(--tui-background-neutral-1-hover)] [&>*]:border-[var(--tui-background-neutral-1-hover)]  rounded-full bg-[var(--tui-background-neutral-1)]"
        >
          <a
            *ngIf="!isOnPersonalInfoPage()"
            [href]="myAccountUrl"
            target="_blank"
            class="flex flex-1 space-x-2 justify-center items-center"
          >
            <tui-icon icon="@tui.user-pen" class="text-sm" />
            <span>Profile</span>
          </a>
          <div
            class="flex flex-1 space-x-2 justify-center items-center"
            tabindex="0"
            (click)="onLogout()"
            (keydown.enter)="onLogout()"
            (keydown.space)="onLogout()"
          >
            <tui-icon icon="@tui.log-out" class="text-sm" />
            <span>Logout</span>
          </div>
        </div>

        <ecomma-color-mode-switcher class="flex w-full h-10" />

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
  protected basicInfo: Nullable<IMeBasicInfoResponse> = null;

  constructor(
    protected layoutService: EbbAppService,
    protected siteService: EcommaSite,
    protected authenticate: Authenticate,
    protected domainName: DomainName,
    protected currentUser: CurrentUser
  ) {
    this.currentUser.basicInfo$.subscribe((info) => {
      this.basicInfo = info;
    });
  }

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

  public isOnPersonalInfoPage() {
    return this.domainName.isOnComponent(DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE);
  }

  public get myAccountUrl() {
    return this.domainName.getUrl(DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE);
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

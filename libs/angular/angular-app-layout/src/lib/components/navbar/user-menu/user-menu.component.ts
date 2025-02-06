import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiDropdown, TuiFallbackSrcPipe, TuiIcon } from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiSegmented,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { AppLayoutService } from '../../../services';

const LANGUAGES = [
  { code: 'en', title: 'English' },
  { code: 'vn', title: 'Tiếng Việt' },
];

@Component({
  selector: 'app-layout-user-menu',
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
    TuiSegmented,
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    TuiTextfieldControllerModule,
  ],
  styles: [
    `
      :host {
        --tui-height-l: 2.7rem;
      }
    `,
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

    <ng-template #userMenu>
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
          class="flex text-sm lg:text-base justify-between w-full border border-[var(--tui-background-neutral-1-hover)] rounded-full bg-[var(--tui-background-neutral-1)]"
        >
          <div
            class="flex flex-1 p-3.5 space-x-2 justify-center items-center border-r border-[var(--tui-background-neutral-1-hover)] hover:bg-[var(--tui-background-neutral-1-hover)] rounded-s-full"
          >
            <tui-icon icon="@tui.user-pen" />
            <span>Your profile</span>
          </div>
          <div
            class="flex flex-1 p-3.5 space-x-2 justify-center items-center hover:bg-[var(--tui-background-neutral-1-hover)] rounded-e-full"
          >
            <tui-icon icon="@tui.log-out" />
            <span>Logout</span>
          </div>
        </div>

        <tui-segmented
          size="l"
          [style.border-radius.rem]="10"
          class="flex justify-between"
          [activeItemIndex]="getCurrentColorModeIndex()"
        >
          <button
            type="button"
            class="text-sm lg:text-base text-center"
            (click)="onChangeColorMode('light')"
          >
            Light
          </button>
          <button
            type="button"
            class="text-sm lg:text-base text-center"
            (click)="onChangeColorMode('dark')"
          >
            Dark
          </button>
          <button
            type="button"
            class="text-sm lg:text-base text-center"
            (click)="onChangeColorMode('monochrome')"
          >
            Monochrome
          </button>
          <button
            type="button"
            class="text-sm lg:text-base text-center"
            (click)="onChangeColorMode('system')"
          >
            System
          </button>
        </tui-segmented>

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
export class UserMenuComponent {
  protected open = false;

  constructor(public layoutService: AppLayoutService) {}

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
    this.layoutService.colorMode = mode;
    this.open = false;
  }

  protected getCurrentColorModeIndex() {
    switch (this.layoutService.colorMode) {
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

  protected readonly control = new FormControl('en');
  protected readonly items = LANGUAGES.map(({ code }) => code);
  protected readonly stringify = (code: string): string =>
    `${LANGUAGES.find((i) => i.code === code)?.title}`;
}

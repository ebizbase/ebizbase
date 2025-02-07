import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSegmented, TuiTooltip } from '@taiga-ui/kit';
import { EbbSiteService } from '../services';

@Component({
  selector: 'ebb-site-color-mode-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiIcon, TuiSegmented, TuiTooltip],
  styles: [':host{--tui-height-s: 100%}'],
  template: `
    <tui-segmented
      [style.border-radius.rem]="10"
      class="flex justify-between w-full h-full"
      [activeItemIndex]="getCurrentColorModeIndex()"
    >
      <button
        type="button"
        class="text-sm lg:text-base w-full h-full flex justify-center"
        (click)="onChangeColorMode('light')"
      >
        <tui-icon icon="@tui.sun" tuiTooltip="Light mode – Bright theme, suitable for daytime." />
      </button>
      <button
        type="button"
        class="text-sm lg:text-base w-full h-full flex justify-center"
        (click)="onChangeColorMode('dark')"
      >
        <tui-icon
          icon="@tui.moon"
          tuiTooltip="Dark mode – Dark theme, easy on the eyes at night."
        />
      </button>
      <button
        type="button"
        class="text-sm lg:text-base w-full h-full flex justify-center"
        (click)="onChangeColorMode('monochrome')"
      >
        <tui-icon icon="@tui.contrast" tuiTooltip="Monochrome mode – Uses a single color tone." />
      </button>
      <button
        type="button"
        class="text-sm lg:text-base w-full h-full flex justify-center"
        (click)="onChangeColorMode('system')"
      >
        <tui-icon
          icon="@tui.sun-moon"
          tuiTooltip="System mode – Follows your system’s theme settings."
        />
      </button>
    </tui-segmented>
  `,
})
export class EbbColorModeSwitcher {
  constructor(public siteService: EbbSiteService) {}

  protected onChangeColorMode(mode: 'dark' | 'light' | 'monochrome' | 'system') {
    this.siteService.colorMode = mode;
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
}

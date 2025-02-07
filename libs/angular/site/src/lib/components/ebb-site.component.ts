import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { EbbSiteService } from '../services/ebb-site.service';

@Component({
  selector: 'ebb-site',
  imports: [NgClass, TuiRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        // Set the default font for the taiga-ui components
        --tui-font-heading: var(--font-sans);
        --tui-font-text: var(--font-sans);
      }
    `,
  ],
  template: `
    <tui-root
      [attr.tuiTheme]="site.isDarkMode ? 'dark' : 'light'"
      [ngClass]="{ dark: site.isDarkMode, grayscale: this.site.isMonochromeMode }"
    >
      <ng-content></ng-content>
      <ng-container ngProjectAs="tuiOverContent" />
      <ng-container ngProjectAs="tuiOverDialogs" />
      <ng-container ngProjectAs="tuiOverAlerts" />
      <ng-container ngProjectAs="tuiOverDropdowns" />
      <ng-container ngProjectAs="tuiOverHints" />
    </tui-root>
  `,
})
export class EbbSite {
  constructor(public site: EbbSiteService) {}
}

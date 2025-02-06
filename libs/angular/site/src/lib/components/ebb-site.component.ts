import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { EbbSiteService } from '../services/ebb-site.service';

@Component({
  selector: 'ebb-site',
  imports: [NgClass, TuiRoot],
  template: `
    <tui-root [attr.tuiTheme]="tuiTheme" [ngClass]="{ grayscale: this.site.isMonochromeMode() }">
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

  public get tuiTheme(): string {
    return this.site.isDarkMode() ? 'dark' : 'light';
  }
}

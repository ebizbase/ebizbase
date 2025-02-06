import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResponsiveHelperComponent } from '@ebizbase/angular-common';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  standalone: true,
  imports: [TuiRoot, RouterModule, ResponsiveHelperComponent],
  selector: 'app-root',
  template: `
    <tui-root>
      <router-outlet></router-outlet>
      <ng-container ngProjectAs="tuiOverContent"></ng-container>
      <ng-container ngProjectAs="tuiOverDialogs"></ng-container>
      <ng-container ngProjectAs="tuiOverAlerts"></ng-container>
      <ng-container ngProjectAs="tuiOverDropdowns"></ng-container>
      <ng-container ngProjectAs="tuiOverHints"></ng-container>
    </tui-root>
    <responsive-helper />
  `,
})
export class AppComponent {}

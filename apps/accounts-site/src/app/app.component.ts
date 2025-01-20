import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  standalone: true,
  imports: [TuiRoot, RouterModule],
  selector: 'app-root',
  template: `
    <tui-root>
      <div class="bg-gray-50 font-[sans-serif] text-[#333] min-h-screen">
        <router-outlet></router-outlet>
      </div>
      <ng-container ngProjectAs="tuiOverContent"></ng-container>
      <ng-container ngProjectAs="tuiOverDialogs"></ng-container>
      <ng-container ngProjectAs="tuiOverAlerts"></ng-container>
      <ng-container ngProjectAs="tuiOverDropdowns"></ng-container>
      <ng-container ngProjectAs="tuiOverHints"></ng-container>
    </tui-root>
  `,
})
export class AppComponent {}

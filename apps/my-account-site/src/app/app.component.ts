import { Component } from '@angular/core';
import { EbbApp, EbbAppService, MenuItem } from '@ebizbase/angular-app';

const pages: MenuItem[] = [
  {
    items: [
      {
        icon: '@tui.id-card',
        label: 'Personal Info',
        route: '/personal-info',
      },
      {
        icon: '@tui.lock-keyhole',
        label: 'Security',
        route: '/security',
      },
      {
        icon: '@tui.lock-keyhole',
        label: 'Privacy',
        route: '/privacy',
      },
    ],
  },
];

@Component({
  standalone: true,
  imports: [EbbApp],
  selector: 'app-root',
  template: ' <ebb-app /> ',
})
export class AppComponent {
  constructor(private app: EbbAppService) {
    this.app.menus = pages;
  }
}

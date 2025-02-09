import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  imports: [EbbApp, RouterOutlet],
  selector: 'app-main-layout',
  template: ' <ebb-app><router-outlet></router-outlet></ebb-app>',
})
export class MainLayoutComponent {
  constructor(private app: EbbAppService) {
    this.app.menus = pages;
  }
}

import { Component } from '@angular/core';
import { AppLayoutComponent, AppLayoutService, MenuItem } from '@ebizbase/angular-app-layout';
import { ResponsiveHelperComponent } from '@ebizbase/angular-common';

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
  imports: [ResponsiveHelperComponent, AppLayoutComponent],
  selector: 'app-root',
  template: `
    <app-layout />
    <responsive-helper />
  `,
})
export class AppComponent {
  constructor(layoutService: AppLayoutService) {
    layoutService.menus = pages;
  }
}

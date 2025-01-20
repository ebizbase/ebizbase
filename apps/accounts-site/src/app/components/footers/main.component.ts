import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [CommonModule, TuiButton],
  template: `
    <div *ngFor="let menu of menus">
      <a [href]="menu.href">
        <button tuiButton appearance="flat" size="xs">{{ menu.label }}</button>
      </a>
    </div>
  `,
})
export default class MainFooterComponent {
  menus = [
    {
      label: 'Help',
      href: '',
    },
    {
      label: 'Privacy',
      href: '#',
    },
  ];
}

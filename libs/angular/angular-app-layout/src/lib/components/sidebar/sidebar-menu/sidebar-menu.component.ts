import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { AppLayoutService } from '../../../services';
import { SidebarSubmenuComponent } from '../sidebar-submenu/sidebar-submenu.component';

@Component({
  selector: 'app-layout-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TuiIcon, RouterLink, SidebarSubmenuComponent],
})
export class SidebarMenuComponent {
  constructor(public layoutService: AppLayoutService) {}
}

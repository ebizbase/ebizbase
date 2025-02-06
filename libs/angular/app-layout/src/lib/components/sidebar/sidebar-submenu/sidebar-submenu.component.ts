import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { SubMenuItem } from '../../../models/menu.model';
import { AppLayoutService } from '../../../services';

@Component({
  selector: 'app-layout-sidebar-submenu',
  templateUrl: './sidebar-submenu.component.html',
  imports: [CommonModule, RouterModule, RouterLink, TuiIcon],
})
export class SidebarSubmenuComponent {
  @Input() public submenu = <SubMenuItem>{};

  constructor(public layoutService: AppLayoutService) {}

  private collapse(items: Array<SubMenuItem>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) {
        this.collapse(item.children);
      }
    });
  }
}

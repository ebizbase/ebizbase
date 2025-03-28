import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { SubMenuItem } from '../../../models/menu.model';
import { EbbAppService } from '../../../services';

@Component({
  selector: 'ebb-app-sidebar-submenu',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgFor, NgClass, NgTemplateOutlet, RouterLinkActive, RouterLink, TuiIcon],
  template: `<div
    class="max-h-0 overflow-hidden pt-1 pl-4 transition-all duration-500"
    [ngClass]="{ 'max-h-screen': submenu.expanded }"
  >
    <ul class="flex flex-col border-l border-dashed border-border pl-2">
      <li *ngFor="let sub of submenu.children">
        <div
          class="flex rounded hover:bg-[var(--tui-background-neutral-1-hover)]"
          tabindex="0"
          (click)="layoutService.toggleSubMenu(sub)"
          (keydown.enter)="layoutService.toggleSubMenu(sub)"
          (keydown.space)="layoutService.toggleSubMenu(sub)"
        >
          <!-- Condition -->
          <ng-container
            [ngTemplateOutlet]="sub.children ? childMenu : parentMenu"
            [ngTemplateOutletContext]="{ sub: sub }"
          >
          </ng-container>

          <!-- Parent Menu -->
          <ng-template #parentMenu let-sub="sub">
            <a
              [routerLink]="sub.route"
              routerLinkActive="text-[var(--tui-text-action)]"
              [routerLinkActiveOptions]="{ exact: true }"
              class="inline-block w-full px-4 py-2 text-xs lg:text-sm font-semibold"
            >
              {{ sub.label }}
            </a>
          </ng-template>

          <!-- Child Menu -->
          <ng-template #childMenu let-sub="sub">
            <a
              class="inline-block w-full cursor-pointer px-4 py-2 text-xs lg:text-sm font-semibold"
            >
              {{ sub.label }}
            </a>
            <button
              [ngClass]="{ 'rotate-90': sub.expanded }"
              class="flex items-center p-1 transition-all duration-500"
            >
              <tui-icon icon="assets/icons/heroicons/solid/chevron-right.svg" [ngClass]="'h-5 w-5'">
              </tui-icon>
            </button>
          </ng-template>
        </div>
        <!-- Submenu items -->
        <ebb-app-sidebar-submenu [submenu]="sub" />
      </li>
    </ul>
  </div> `,
})
export class SidebarSubmenu {
  @Input() public submenu = <SubMenuItem>{};

  constructor(public layoutService: EbbAppService) {}

  private collapse(items: Array<SubMenuItem>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) {
        this.collapse(item.children);
      }
    });
  }
}

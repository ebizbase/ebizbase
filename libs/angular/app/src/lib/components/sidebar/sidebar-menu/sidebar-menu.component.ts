import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { EbbAppService } from '../../../services';
import { SidebarSubmenu } from '../sidebar-submenu/sidebar-submenu.component';

@Component({
  selector: 'ebb-app-sidebar-menu',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgFor, NgClass, NgTemplateOutlet, NgIf, TuiIcon, RouterLink, SidebarSubmenu],
  template: `<div class="pt-4" *ngFor="let menu of layoutService.menus">
    <div *ngIf="menu.group" class="mx-1 mb-2 flex items-center justify-between">
      <small class="text-xs lg:text-sm font-semibold text-[var(--tui-text-secondary)]">
        {{ menu.group }}
      </small>
    </div>
    <ul class="flex flex-col space-y-1">
      <!-- List items -->
      <li *ngFor="let item of menu.items">
        <!-- Menu List -->
        <div
          tabindex="0"
          (click)="layoutService.toggleSubMenu(item)"
          (keydown.enter)="layoutService.toggleSubMenu(item)"
          (keydown.space)="layoutService.toggleSubMenu(item)"
          class="group relative"
        >
          <!-- Icon -->
          <div
            [ngClass]="item.active ? 'text-[var(--tui-text-action)]' : ''"
            class="pointer-events-none absolute m-2"
          >
            <tui-icon icon="{{ item.icon }}" [ngClass]="'h-5 w-5'"> </tui-icon>
          </div>

          <!-- Condition -->
          <ng-container
            [ngTemplateOutlet]="item.children ? childMenu : parentMenu"
            [ngTemplateOutletContext]="{ item: item }"
          >
          </ng-container>

          <!-- Workaround:: Enable routerLink -->
          <ng-template #parentMenu let-item="item">
            <div
              routerLink="{{ item.route }}"
              class="flex h-9 cursor-pointer items-center justify-start rounded hover:bg-[var(--tui-background-neutral-1-hover)]"
            >
              <a
                [ngClass]="item.active ? 'text-[var(--tui-text-action)]' : ''"
                class="ml-10 truncate text-xs lg:text-sm font-semibold tracking-wide focus:outline-none"
              >
                {{ item.label }}
              </a>
            </div>
          </ng-template>

          <!-- Workaround:: Disable routerLink -->
          <ng-template #childMenu let-item="item">
            <div
              class="flex h-9 cursor-pointer items-center justify-start rounded hover:bg-[var(--tui-background-neutral-1-hover)]"
            >
              <a
                [ngClass]="item.active ? 'text-[var(--tui-text-action)]' : ''"
                class="ml-10 truncate text-xs lg:text-sm font-semibold tracking-wide focus:outline-none"
              >
                {{ item.label }}
              </a>
            </div>
          </ng-template>

          <!-- Arrow Icon -->
          <button
            *ngIf="item.children"
            [ngClass]="{ 'rotate-90': item.expanded }"
            class="pointer-events-none absolute top-1 right-0 flex items-center p-1 transition-all duration-500"
          >
            <tui-icon icon="assets/icons/heroicons/solid/chevron-right.svg" [ngClass]="'h-5 w-5'">
            </tui-icon>
          </button>
        </div>

        <!-- Submenu items -->
        <ebb-app-sidebar-submenu [submenu]="item" />
      </li>
    </ul>

    <div class="pt-3" *ngIf="menu.separator">
      <hr class="border-border" />
    </div>
  </div> `,
})
export class SidebarMenu {
  constructor(public layoutService: EbbAppService) {}
}

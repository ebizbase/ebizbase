import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { clsx } from 'clsx';
import { EbbAppService } from '../../services';
import { SidebarMenu } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'ebb-app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SidebarMenu],
  template: `
    <div class="flex lg:hidden items-center space-x-1 h-14 pl-2">
      <img class="h-5" src="/images/logo.svg" alt="Logo" />
      <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
        >comma</span
      >
      <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
        >Account</span
      >
    </div>
    <ebb-app-sidebar-menu />
  `,
})
export class Sidebar {
  constructor(public layoutService: EbbAppService) {}

  @HostBinding('class') get classes() {
    return clsx(
      'scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-card scrollbar-thin scrollbar-track-transparent overflow-auto',
      'transition-all duration-300',
      'w-72 px-2 md:px-3 lg:px-4',
      'bg-[var(--tui-background-base)] lg:bg-[var(--tui-background-base-alt)]',
      'fixed left-0 top-0 h-screen lg:h-[calc(100dvh-3.5rem)] flex-col justify-between lg:relative lg:flex -translate-x-full lg:translate-x-0',
      {
        '!translate-x-0 h-[calc(100dvh)]': this.layoutService.mobileSidebarOpened,
      }
    );
  }
}

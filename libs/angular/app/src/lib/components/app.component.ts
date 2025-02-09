import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { EcommaRoot, EcommaSite } from '@ebizbase/angular-common';
import clsx from 'clsx';
import { EbbAppService } from '../services';
import { Navbar } from './navbar/navbar.component';
import { PageHeading } from './page-heading/page-heading.component';
import { Sidebar } from './sidebar/sidebar.component';

@Component({
  selector: 'ebb-app',
  imports: [NgIf, NgClass, Navbar, Sidebar, PageHeading, EcommaRoot],
  template: `
    <ecomma-root>
      <div class="flex flex-col h-[calc(100dvh)] overflow-hidden text-base">
        <ebb-app-navbar />
        <div
          class="flex flex-row-reverse bg-[var(--tui-background-base-alt)] transition-all duration-300"
        >
          <div
            class="flex flex-col flex-1 h-[calc(100dvh-3.5rem)] bg-[var(--tui-background-base)]"
            [ngClass]="{ 'lg:rounded-tl-3xl': layoutService.menus.length > 0 }"
          >
            <div class="flex w-full h-16 items-center" *ngIf="layoutService.info?.heading">
              <ebb-app-page-heading class="px-2 lg:px-4 {{ getContentSizeClsx() }}" />
            </div>
            <div
              id="main-content"
              class="flex-1 w-full {{ scrollbarClsx }}"
              [ngClass]="{
                'h-[calc(100dvh-8rem)]': layoutService.info?.heading,
                'h-[calc(100dvh-4rem)]': !layoutService.info?.heading,
              }"
            >
              <div class="p-4 lg:p-8 pb-20 {{ getContentSizeClsx() }}">
                <ng-content></ng-content>
              </div>
            </div>
          </div>
          <div
            class="fixed top-0 bottom-0 w-screen transition-all duration-750 backdrop-blur-[0px] lg:hidden -translate-x-full"
            tabindex="0"
            [ngClass]="getSidebarClassClsx()"
            (click)="layoutService.toggleMobileSidebar()"
            (keydown.enter)="layoutService.toggleMobileSidebar()"
            (keydown.space)="layoutService.toggleMobileSidebar()"
            (wheel)="$event.preventDefault()"
            (touchmove)="$event.preventDefault()"
          ></div>
          <ebb-app-sidebar *ngIf="layoutService.menus.length > 0"></ebb-app-sidebar>
        </div>
      </div>
    </ecomma-root>
  `,
})
export class EbbApp {
  protected readonly scrollbarClsx =
    'scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-[var(--tui-background-neutral-2)] scrollbar-thin scrollbar-track-transparent scrollbar-corner-rounded-full';
  constructor(
    public layoutService: EbbAppService,
    protected siteService: EcommaSite
  ) {}

  getSidebarClassClsx() {
    return clsx({ 'translate-x-0 backdrop-blur-[2px]': this.layoutService.mobileSidebarOpened });
  }

  getContentSizeClsx() {
    return clsx('w-full', 'mx-auto', {
      'max-w-2xl': this.layoutService.info?.contentSize === 'xs',
      'max-w-3xl': this.layoutService.info?.contentSize === 's',
      'max-w-4xl': this.layoutService.info?.contentSize === 'm',
      'max-w-5xl': this.layoutService.info?.contentSize === 'l',
      'max-w-6xl': this.layoutService.info?.contentSize === 'xl',
      'max-w-7xl': this.layoutService.info?.contentSize === 'xxl',
    });
  }
}

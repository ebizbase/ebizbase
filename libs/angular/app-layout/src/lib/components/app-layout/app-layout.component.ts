import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbSite, EbbSiteService } from '@ebizbase/angular-site';
import clsx from 'clsx';
import { AppLayoutService } from '../../services';
import { NavbarComponent } from '../navbar/navbar.component';
import { PageHeadingComponent } from '../page-heading/page-heading.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    PageHeadingComponent,
    EbbSite,
  ],
  template: `
    <ebb-site>
      <app-layout-navbar />
      <div class="flex flex-row-reverse bg-[var(--tui-background-base-alt)]">
        <div
          class="lg:rounded-tl-3xl flex flex-col flex-1 h-[calc(100dvh-3.5rem)] bg-[var(--tui-background-base)]"
        >
          <div class="flex w-full h-16 items-center" *ngIf="layoutService.info?.heading">
            <app-layout-page-heading class="px-2 lg:px-4 {{ getContentSizeClsx() }}" />
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
              <router-outlet></router-outlet>
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
        <app-layout-sidebar *ngIf="layoutService.menus.length > 0"></app-layout-sidebar>
      </div>
    </ebb-site>
  `,
})
export class AppLayoutComponent {
  protected readonly scrollbarClsx =
    'scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-[var(--tui-background-neutral-2)] scrollbar-thin scrollbar-track-transparent scrollbar-corner-rounded-full';
  constructor(
    public layoutService: AppLayoutService,
    protected siteService: EbbSiteService
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

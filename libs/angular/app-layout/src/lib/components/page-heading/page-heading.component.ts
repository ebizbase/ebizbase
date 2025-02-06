import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { AppLayoutService } from '../../services';

@Component({
  selector: 'app-layout-page-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIf, NgFor, TuiButton],
  host: {
    class: 'flex justify-between h-14 items-center mt-2',
  },
  template: `
    <ng-container *ngIf="layoutService.info?.heading?.previous">
      <a
        tuiButton
        class="!rounded-full"
        appearance="flat"
        size="s"
        iconStart="@tui.chevron-left"
        routerLink="{{ layoutService.info?.heading?.previous }}"
      >
      </a>
    </ng-container>
    <h3 class="text-lg font-semibold flex-1">{{ layoutService.info?.heading?.title }}</h3>
    <div class="inline-flex gap-3" *ngIf="layoutService.info?.heading?.actions">
      <button
        *ngFor="let action of layoutService.info?.heading?.actions"
        class="!rounded-full lg:!rounded-md"
        appearance="flat"
        tuiButton
        size="s"
        [iconStart]="action.icon"
        (click)="action.click && action.click()"
      >
        <span class="hidden lg:block">{{ action.title }}</span>
      </button>
    </div>
  `,
})
export class PageHeadingComponent {
  constructor(public layoutService: AppLayoutService) {}
}

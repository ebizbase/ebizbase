import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EbbAppService } from '@ebizbase/angular-app';
import { CurrentUser, EcommaSite } from '@ebizbase/angular-common';
import { Nullable } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avatar',
  imports: [NgIf, TuiIcon, TuiButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center px-0 lg:px-24 space-y-24 py-12 border rounded-lg ',
  },
  template: `
    <img
      *ngIf="basicInfo.avatar"
      src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"
      alt=""
      class="max-w-64"
    />
    <div
      *ngIf="!basicInfo.avatar"
      class="flex items-center justify-center max-w-64 w-full aspect-1 bg-[var(--tui-background-accent-2)] rounded-full"
    >
      <tui-icon class="text-[14rem] text-[var(--tui-text-primary-on-accent-1)]" icon="@tui.user" />
    </div>
    <p>
      A picture helps people recognize you and lets you know when you’re signed in to your account
    </p>
    <div class="w-full flex justify-between space-x-6 mt-10">
      <button tuiButton class="min-w-28" type="button" size="m" appearance="secondary">
        Remove
      </button>
      <a routerLink="./change" tuiButton class="min-w-28" type="button" size="m">Change</a>
    </div>
  `,
})
export class AvatarComponent implements OnDestroy {
  private _subscription = new Subscription();
  protected basicInfo: Nullable<IMeBasicInfoResponse> = null;

  constructor(
    private app: EbbAppService,
    private currentUser: CurrentUser,
    private cdr: ChangeDetectorRef,
    private site: EcommaSite
  ) {
    this.site.title = 'Profile picture';
    this.app.pageInfo = {
      contentSize: 'xs',
      heading: {
        title: 'Profile picture',
        previous: './',
      },
    };
    this._subscription.add(
      this.currentUser.basicInfo$.subscribe((info) => {
        this.basicInfo = info;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}

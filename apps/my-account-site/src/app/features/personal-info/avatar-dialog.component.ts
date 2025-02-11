import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { CurrentUser } from '@ebizbase/angular-common';
import { Nullable } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { TuiButton, tuiDialog, TuiDialogContext, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { ChangeAvatarDialogComponent } from './change-avatar-dialog.component';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, TuiIcon, TuiButton, NgClass],
  host: { class: 'flex flex-col items-center' },
  template: `
    <p class="mt-6 mb-12 text-center">
      A picture helps people recognize you and lets you know when you’re signed in to your account
    </p>
    <img
      *ngIf="basicInfo.avatar"
      src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"
      alt=""
      class="max-w-56"
    />
    <div
      *ngIf="!basicInfo.avatar"
      class="flex items-center justify-center max-w-56 w-full aspect-1 bg-[var(--tui-background-accent-2)] rounded-full"
    >
      <tui-icon class="text-[14rem] text-[var(--tui-text-primary-on-accent-1)]" icon="@tui.user" />
    </div>

    <div
      class="w-full flex justify-between space-x-6 mt-12"
      [ngClass]="{ '!justify-center': !basicInfo.avatar }"
    >
      <button
        tuiButton
        class="min-w-28"
        type="button"
        size="m"
        appearance="secondary"
        *ngIf="basicInfo.avatar"
        (click)="changeAvatarDialog().subscribe()"
      >
        Remove
      </button>
      <button
        tuiButton
        class="min-w-28"
        type="button"
        size="m"
        (click)="changeAvatarDialog().subscribe()"
      >
        Change
      </button>
    </div>
  `,
})
export class AvatarDialogComponent implements OnDestroy {
  private readonly dialogs = inject(TuiDialogService);

  private _subscription = new Subscription();

  private currentUser: CurrentUser = inject(CurrentUser);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected readonly changeAvatarDialog = tuiDialog(ChangeAvatarDialogComponent, {
    dismissible: true,
    label: 'Send feedback to eBizBase',
  });
  protected basicInfo: Nullable<IMeBasicInfoResponse> = null;

  constructor() {
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

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }
}

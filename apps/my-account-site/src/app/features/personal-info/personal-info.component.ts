import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EbbAppService } from '@ebizbase/angular-app';
import { CurrentUser } from '@ebizbase/angular-common';
import { Nullable } from '@ebizbase/common-types';
import { IMeBasicInfoResponse } from '@ebizbase/iam-interfaces';
import { tuiDialog, TuiFallbackSrcPipe, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import { FeedbackDialogComponent } from '../../shared/components/feedback/feedback-dialog.component';
import { PageHeadingComponent } from '../../shared/components/page-heading/page-heading.component';

@Component({
  selector: 'app-personal-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    TuiTextfield,
    TuiAvatar,
    TuiIcon,
    TuiFallbackSrcPipe,
    PageHeadingComponent,
  ],
  template: `
    <app-page-heading
      title="Personal info"
      subtitle="Info about you and your preferences across eBizBase services"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Name Options -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] rounded-lg lg:col-span-2 border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="py-3 px-4">
          <h2 class="text-lg font-medium">Basic Info</h2>
          <h3 class="text-[var(--tui-text-secondary)]">
            visible to others so they can reach you easily
          </h3>
        </div>
        <!-- Profile Image -->
        <a
          routerLink="avatar"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)]"
        >
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="font-medium lg:flex-1 text-[var(--tui-text-secondary)] max-w-60">
              Profile Picture
            </div>
            <div class="flex lg:flex-1 space-x-1">
              A profile picture helps personalize your account
            </div>
          </div>
          <div class="relative rounded-full">
            <tui-avatar
              appearance="accent"
              [src]="basicInfo?.avatar ?? '' | tuiFallbackSrc: '@tui.user' | async"
              size="xl"
            />
            <div
              class="absolute top-0 w-full h-full flex justify-center items-center text-white bg-black/20 rounded-full"
            >
              <tui-icon icon="@tui.pencil" size="m" />
            </div>
          </div>
        </a>
        <!-- Display name -->
        <a
          routerLink="display-name"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t rounded-b-lg border-[var(--tui-background-neutral-1-hover)]"
        >
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="font-medium lg:flex-1 text-[var(--tui-text-secondary)] max-w-60">
              Display Name
            </div>
            <div class="text-base flex lg:flex-1 space-x-1 items-center">{{ basicInfo?.name }}</div>
          </div>
          <div class="w-24 text-right"><tui-icon icon="@tui.chevron-right" /></div>
        </a>
      </div>

      <div
        class="flex flex-col bg-[var(--tui-background-base)] rounded-lg border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="py-3 px-4">
          <h2 class="text-lg">General preferences for the web</h2>
          <h3 class="text-[var(--tui-text-secondary)]">
            Manage settings for eBizBase products and services
          </h3>
        </div>
        <a
          routerLink="color-mode"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.blend" />
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="font-medium lg:flex-1 text-[var(--tui-text-secondary)]">Color Mode</div>
            <div class="flex lg:flex-1 space-x-1">
              <span>Monochrome</span>
            </div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <a
          routerLink="language"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t rounded-b-lg border-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.languages" />
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="font-medium lg:flex-1 text-[var(--tui-text-secondary)]">Language</div>
            <div class="flex lg:flex-1 space-x-1 items-center">English</div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
      </div>

      <!-- Others -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] rounded-lg border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="pt-3 pb-5 px-4">
          <h2 class="text-lg font-medium">Looking for something else?</h2>
        </div>
        <div
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.circle-help" />
          <div class="text-base lg:flex-1">View help options</div>
          <tui-icon icon="@tui.chevron-right" />
        </div>
        <div
          tabindex="0"
          (click)="feedbackDialog().subscribe()"
          (keydown.enter)="feedbackDialog().subscribe()"
          (keydown.space)="feedbackDialog().subscribe()"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t border-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.message-square-warning" />
          <div class="text-base lg:flex-1">Send feedback</div>
          <tui-icon icon="@tui.chevron-right" />
        </div>
        <div class="pb-4"></div>
      </div>
    </div>
  `,
})
export class PersonalInfoComponent implements OnDestroy {
  private _subscription = new Subscription();
  protected basicInfo: Nullable<IMeBasicInfoResponse> = null;

  protected readonly feedbackDialog = tuiDialog(FeedbackDialogComponent, {
    dismissible: true,
    label: 'Send feedback to eBizBase',
  });

  constructor(
    private app: EbbAppService,
    private currentUser: CurrentUser,
    private cdr: ChangeDetectorRef
  ) {
    this.app.pageInfo = {
      title: 'eBizBase Account',
      contentSize: 'm',
    };
    this._subscription.add(
      this.currentUser.basicInfo$.subscribe((info) => {
        this.basicInfo = info;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}

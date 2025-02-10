import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { EcommaSite } from '@ebizbase/angular-common';
import { tuiDialog, TuiIcon, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { FeedbackDialogComponent } from '../../shared/components/feedback/feedback-dialog.component';
import { PageHeadingComponent } from '../../shared/components/page-heading/page-heading.component';

@Component({
  selector: 'app-security',
  imports: [TuiTextfield, TuiAvatar, TuiIcon, TuiCell, TuiLink, PageHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-heading title="Security" subtitle="Settings options to keep your account secure" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Security Activity -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] lg:col-span-2 rounded-lg border border-[var(--tui-background-neutral-1-hover)] [&>:not]"
      >
        <div class="pt-3 pb-5 px-4">
          <h2 class="text-lg font-medium">Recent Security Activities</h2>
        </div>
        <a class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)]">
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">New sign-in on Windows</div>
            <div class="flex lg:flex-1 space-x-1">Jan 31, 2023 - Thanh Hóa, Việt Nam</div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <a
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t border-[var(--tui-background-neutral-1-hover)]"
        >
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">New sign-in on Apple iPad Pro 11</div>
            <div class="flex lg:flex-1 space-x-1">Jan 31, 2023 - Thanh Hóa, Việt Nam</div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <a
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t border-[var(--tui-background-neutral-1-hover)]"
        >
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">New sign-in on Apple iPhone 12 Pro Max</div>
            <div class="flex lg:flex-1 space-x-1">Jan 31, 2023 - Thanh Hóa, Việt Nam</div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <div
          class="border-t p-4 border-[var(--tui-background-neutral-1-hover)] hover:bg-[var(--tui-background-neutral-1-hover)] rounded-b-lg"
        >
          <a tuiLink class="!font-medium" href="#">Review security activities (4) </a>
        </div>
      </div>

      <!-- Sign In Options -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] lg:col-span-2 rounded-lg border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="pt-3 pb-5 px-4">
          <h2 class="text-lg font-medium">2-Step Verification</h2>
          <h3 class="text-[var(--tui-text-secondary)]">
            Make sure you can always access your eBizbase account by keeping this information up to
            date
          </h3>
        </div>
        <a
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t border-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.shield-plus" />
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">2-Step Verification Status</div>
            <div class="flex lg:flex-1 space-x-1 items-center">
              <tui-icon icon="@tui.circle-check" class="text-base lg:text-lg text-positive" />
              <span>On since Aug 19, 2015</span>
            </div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <a
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t border-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.scan-qr-code" />
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">Authenticator App Verify</div>
            <div class="flex lg:flex-1 space-x-1 items-center">
              <tui-icon icon="@tui.circle-check" class="text-base lg:text-lg text-positive" />
              <span>On since Aug 19, 2015</span>
            </div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
        <a
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)] border-t rounded-b-lg border-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.smartphone" />
          <div class="flex flex-col flex-1 lg:flex-row w-full lg:items-center">
            <div class="text-base lg:flex-1">Phone Verify</div>
            <div class="flex lg:flex-1 space-x-1 items-center">
              <tui-icon icon="@tui.circle-x" class="text-base lg:text-lg text-negative" />
              <span>Not setup yet</span>
            </div>
          </div>
          <tui-icon icon="@tui.chevron-right" />
        </a>
      </div>

      <!-- Sessions & Devices -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] rounded-lg border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="pt-3 pb-5 px-4">
          <h2 class="text-lg font-medium">Your Sessions</h2>
          <h3 class="text-[var(--tui-text-secondary)]">Where you're signed in?</h3>
        </div>
        <div tuiCell="l">
          <tui-avatar appearance="primary" src="@tui.grid-2x2" />
          <div tuiTitle>
            3 Sessions on Windows Computer
            <div tuiSubtitle>John' PC, John's Laptop, Win...</div>
          </div>
        </div>
        <div tuiCell="l">
          <tui-avatar appearance="primary" src="@tui.command" />
          <div tuiTitle>
            1 Sessions on Mac Osx Computer
            <div tuiSubtitle>John's Macbook Pro, John's Mac...</div>
          </div>
        </div>
        <div class="py-3 px-4 text-[var(--tui-text-tertiary)]">
          You're signed in on more devices
        </div>
        <div class="border-t py-3 px-4 border-[var(--tui-background-neutral-1-hover)]">
          <a tuiLink href="#">Manager all sessions</a>
        </div>
      </div>

      <!-- Others -->
      <div
        class="flex flex-col bg-[var(--tui-background-base)] rounded-lg border border-[var(--tui-background-neutral-1-hover)]"
      >
        <div class="pt-3 pb-5 px-4">
          <h2 class="text-lg font-medium">Looking for something else?</h2>
        </div>
        <div
          tabindex="1"
          class="flex p-4 space-x-2 items-center hover:bg-[var(--tui-background-neutral-1-hover)]"
        >
          <tui-icon icon="@tui.circle-help" />
          <div class="text-base lg:flex-1">View help options</div>
          <tui-icon icon="@tui.chevron-right" />
        </div>
        <div
          (click)="feedbackDialog().subscribe()"
          (keyup)="feedbackDialog().subscribe()"
          tabindex="1"
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
export class SecurityComponent {
  protected readonly feedbackDialog = tuiDialog(FeedbackDialogComponent, {
    dismissible: true,
    label: 'Send feedback to eBizBase',
  });

  constructor(
    private app: EbbAppService,
    private site: EcommaSite
  ) {
    this.site.title = 'Security';
    this.app.pageInfo = {
      contentSize: 'm',
    };
  }
}

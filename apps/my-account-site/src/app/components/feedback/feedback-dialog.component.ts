import type { TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { tuiDialog, TuiDialogService } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { ReportIssueDialogComponent } from './report-issue.component';
import { SuggestIdeaDialogComponent } from './suggest-idea-dialog.component';

@Component({
  selector: 'app-feedback-dialog',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col' },
  template: `
    <button (click)="onReportIssueClick()">Report an issue</button>
    <button (click)="onSuggestIdeaClick()">Suggest an idea</button>
  `,
})
export class FeedbackDialogComponent {
  private readonly dialogs = inject(TuiDialogService);
  public readonly context = injectContext<TuiDialogContext<void, void>>();

  private readonly reportIssueDialog = tuiDialog(ReportIssueDialogComponent, {
    dismissible: true,
    label: 'Report an issue',
  });

  private readonly sugguestIdeaDialog = tuiDialog(SuggestIdeaDialogComponent, {
    dismissible: true,
    label: 'Suggest an idea',
  });

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }

  protected onSuggestIdeaClick() {
    this.context.completeWith();
    this.reportIssueDialog().subscribe();
  }

  protected onReportIssueClick() {
    this.context.completeWith();
    this.sugguestIdeaDialog().subscribe();
  }
}

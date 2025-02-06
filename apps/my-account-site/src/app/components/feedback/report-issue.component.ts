import type { TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-report-issue',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col' },
  template: ' Report an issue ',
})
export class ReportIssueDialogComponent {
  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }
}

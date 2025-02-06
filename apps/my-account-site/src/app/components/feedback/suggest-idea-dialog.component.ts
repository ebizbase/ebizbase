import type { TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiDialogService } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-suggest-idea',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col' },
  template: 'suggest an idea ',
})
export class SuggestIdeaDialogComponent {
  private readonly dialogs = inject(TuiDialogService);
  public readonly context = injectContext<TuiDialogContext<void, void>>();

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }
}

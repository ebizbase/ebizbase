import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

interface Language {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'app-language-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiTextfieldControllerModule,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
  ],
  template: `
    <tui-combo-box [formControl]="control" [stringify]="stringify" tuiTextfieldSize="s">
      <tui-data-list-wrapper
        *tuiDataList
        [itemContent]="stringify | tuiStringifyContent"
        [items]="items | tuiFilterByInput"
      />
    </tui-combo-box>
  `,
})
export default class LanguageSelectComponent {
  protected readonly LANGUAGES: Language[] = [{ id: 'en', name: 'English' }];
  protected readonly control = new FormControl('en');
  protected readonly items = this.LANGUAGES.map(({ id }) => id);
  protected readonly stringify = (id: string): string =>
    this.LANGUAGES.find((item) => item.id === id)?.name || '';
}

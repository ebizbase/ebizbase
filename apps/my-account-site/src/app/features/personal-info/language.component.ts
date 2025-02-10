import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { EcommaSite } from '@ebizbase/angular-common';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-languagues',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class LanguageComponent {
  constructor(
    private app: EbbAppService,
    private site: EcommaSite
  ) {
    this.site.title = 'Language';
    this.app.pageInfo = {
      heading: {
        title: 'Language',
        previous: './',
      },
    };
  }
}

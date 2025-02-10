import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { EcommaSite } from '@ebizbase/angular-common';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-color-mode',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ColorModeComponent {
  constructor(
    private app: EbbAppService,
    private site: EcommaSite
  ) {
    this.site.title = 'Color Mode';
    this.app.pageInfo = {
      heading: {
        title: 'Color Mode',
        previous: './',
      },
    };
  }
}

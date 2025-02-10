import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-color-mode',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ColorModeComponent {
  constructor(private app: EbbAppService) {
    this.app.pageInfo = {
      title: 'Color Mode',
      heading: {
        title: 'Color Mode',
        previous: './',
      },
    };
  }
}

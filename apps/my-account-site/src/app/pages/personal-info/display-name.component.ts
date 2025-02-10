import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-display-name',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DisplayNameComponent {
  constructor(private app: EbbAppService) {
    this.app.pageInfo = {
      title: 'Display name',
      heading: {
        title: 'Display name',
        previous: './',
      },
    };
  }
}

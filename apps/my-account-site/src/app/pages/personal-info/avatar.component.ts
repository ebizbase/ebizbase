import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EbbAppService } from '@ebizbase/angular-app';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class AvatarComponent {
  constructor(private app: EbbAppService) {
    this.app.info = {
      title: 'Avatar',
      heading: {
        title: 'Avatar',
        previous: './',
      },
    };
  }
}

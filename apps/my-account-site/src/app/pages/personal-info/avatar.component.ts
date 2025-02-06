import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLayoutService } from '@ebizbase/angular-app-layout';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class AvatarComponent {
  constructor(private layoutService: AppLayoutService) {
    this.layoutService.info = {
      title: 'Avatar',
      heading: {
        title: 'Avatar',
        previous: './',
      },
    };
  }
}

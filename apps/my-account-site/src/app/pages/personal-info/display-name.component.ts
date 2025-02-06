import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLayoutService } from '@ebizbase/angular-app-layout';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-display-name',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class DisplayNameComponent {
  constructor(private layoutService: AppLayoutService) {
    this.layoutService.info = {
      title: 'Display name',
      heading: {
        title: 'Display name',
        previous: './',
      },
    };
  }
}

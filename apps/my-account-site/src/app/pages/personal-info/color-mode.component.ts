import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLayoutService } from '@ebizbase/angular-app-layout';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-color-mode',
  imports: [CommonModule, TuiTextfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class ColorModeComponent {
  constructor(private layoutService: AppLayoutService) {
    this.layoutService.info = {
      title: 'Color Mode',
      heading: {
        title: 'Color Mode',
        previous: './',
      },
    };
  }
}

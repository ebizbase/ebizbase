import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { FormControlErrorComponent } from './form-control-error.component';

@Component({
  selector: 'form-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextfield,
    FormControlErrorComponent,
  ],
  template: `
    <div class="flex flex-col gap-1">
      <ng-content></ng-content>
      <form-control-error [control]="control" />
    </div>
  `,
})
export class FormControlComponent {
  @Input() control!: FormControl;
}

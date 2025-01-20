import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { FormControlComponent } from '../base/form-control.component';

@Component({
  selector: 'form-control-textfield',
  standalone: true,
  imports: [FormControlComponent, CommonModule, FormsModule, ReactiveFormsModule, TuiTextfield],
  template: `
    <form-control [control]="control">
      <tui-textfield [iconStart]="icon">
        <!-- for attribute will automate by taiga-ui -->
        <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
        <label *ngIf="label" tuiLabel>{{ label }}</label>
        <input
          tuiTextfield
          [formControl]="control"
          [autocomplete]="autocomplete"
          [invalid]="invalid"
          [type]="type"
        />
        <ng-content> </ng-content>
      </tui-textfield>
    </form-control>
  `,
})
export class TextfieldFormControlComponent {
  @Input() control!: FormControl;
  @Input() label?: string;
  @Input() type = 'text';
  @Input() icon?: string;
  @Input() autocomplete?: string = undefined;

  public get invalid(): boolean {
    return this.control.touched && this.control.invalid;
  }
}

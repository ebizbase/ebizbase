import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'form-control-error',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TuiTextfield, TuiIcon],
  template: `
    <div *ngIf="invalid && message" class="flex-1 flex gap-1 items-center text-s ml-2 text-red-500">
      <tui-icon class="h-4" icon="@tui.circle-alert" /> {{ message }}
    </div>
  `,
})
export class FormControlErrorComponent {
  @Input() control!: FormControl;

  public get invalid(): boolean {
    return this.control.touched && this.control.invalid;
  }

  public get message(): string | null {
    if (this.control?.errors) {
      const firstError = this.control.errors[Object.keys(this.control.errors)[0]];
      if (typeof firstError === 'object' && firstError['message']) {
        return firstError['message'];
      } else {
        console.warn(
          'ValidationErrors should be object with value is string. We will use it for display instruction for user edit control. (Tips: use MessageableValidators)'
        );
        return null;
      }
    }
    return null;
  }
}

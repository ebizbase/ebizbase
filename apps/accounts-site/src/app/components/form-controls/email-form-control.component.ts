import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';

@Component({
  selector: 'app-email-form-control',
  standalone: true,
  imports: [CommonModule, TextfieldFormControlComponent],
  template: `
    <form-control-textfield
      [control]="control"
      [type]="'email'"
      [autocomplete]="autocomplete"
      [label]="label"
      [icon]="icon"
    />
  `,
})
export class EmailFormControlComponent {
  @Input() icon?: string;
  @Input() label?: string;
  @Input() autocomplete?: string;

  control = new FormControl('', {
    updateOn: 'change',
    validators: [MessageableValidators.required(), MessageableValidators.email()],
  });
}

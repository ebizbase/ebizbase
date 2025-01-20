import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';

@Component({
  selector: 'app-last-name-form-control',
  standalone: true,
  imports: [CommonModule, TextfieldFormControlComponent],
  template: `
    <form-control-textfield
      [control]="control"
      [autocomplete]="autocomplete"
      label="Last Name"
      type="email"
    />
  `,
})
export class LastNameFormControlComponent {
  @Input() autocomplete?: string;

  control = new FormControl('', {
    validators: [MessageableValidators.required()],
  });
}

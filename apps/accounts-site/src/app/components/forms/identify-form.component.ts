import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { TuiButton, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { Subject } from 'rxjs';
import { GetOTPEvent } from '../../models/get-otp.event';

@Component({
  selector: 'app-identify-form',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLink,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
    TextfieldFormControlComponent,
  ],
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <form-control-textfield
          [control]="emailControl"
          [type]="'email'"
          autocomplete="email"
          label="Email"
          icon="@tui.mail"
        />
        <button tuiButton type="button" [loading]="loading | async" (click)="onFormSubmit()">
          Next
        </button>
        <p class="mt-6 text-xs text-gray-600 text-center">
          I agree to abide by ebizbase's <a href="#" tuiLink>Terms of Service</a> and its
          <a href="#" tuiLink>Privacy Policy</a>
        </p>
      </div>
    </form>
  `,
})
export class IdentifyFormComponent {
  @Input() loading: Subject<boolean>;
  @Output() formSubmit = new EventEmitter<GetOTPEvent>();

  protected form: FormGroup = new FormGroup({
    email: new FormControl('', {
      updateOn: 'change',
      validators: [MessageableValidators.required(), MessageableValidators.email()],
    }),
  });

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  onFormSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formSubmit.emit({ email: this.form.value.email });
    }
  }
}

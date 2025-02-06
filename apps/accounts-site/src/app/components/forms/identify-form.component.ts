import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { Subject } from 'rxjs';
import { GetOTPEvent } from '../../models/get-otp.event';
import { EmailFormControlComponent } from '../form-controls/email-form-control.component';

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
    EmailFormControlComponent,
  ],
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <app-email-form-control autocomplete="email" />
        <button
          tuiButton
          size="m"
          type="button"
          [loading]="loading | async"
          (click)="onFormSubmit()"
        >
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
export class IdentifyFormComponent implements AfterViewInit {
  @Input() loading: Subject<boolean>;
  @Output() formSubmit = new EventEmitter<GetOTPEvent>();

  @ViewChild(EmailFormControlComponent) emailControlComponent: EmailFormControlComponent;

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({});
  }

  ngAfterViewInit(): void {
    this.form.addControl('email', this.emailControlComponent.control);
  }

  onFormSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formSubmit.emit({ email: this.form.value.email });
    }
  }
}

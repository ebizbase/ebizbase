import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { Subject } from 'rxjs';
import { GetOTPEvent } from '../../models/get-otp.event';
import { IdentifyEvent } from '../../models/identify.event';
import { OtpFormControlComponent } from '../form-controls/otp-form-control.component';

@Component({
  selector: 'app-verify-htop-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
    OtpFormControlComponent,
  ],
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <app-otp-form-control (requestOtp)="onRequestOtp()" />
      </div>
      <div
        class="flex flex-col gap-8 justify-center mt-8 md:justify-between md:flex-row md:items-center"
      >
        <button
          tuiButton
          size="m"
          type="button"
          [loading]="loading | async"
          (click)="onFormSubmit()"
        >
          Next
        </button>
      </div>
    </form>
  `,
})
export class VerifyHotpFormComponent implements AfterViewInit {
  @Input() loading: Subject<boolean>;
  @Output() requestOtp = new EventEmitter<GetOTPEvent>();
  @Output() identifySubmit = new EventEmitter<IdentifyEvent>();

  @ViewChild(OtpFormControlComponent) otpControlComponent: OtpFormControlComponent;

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({});
  }

  ngAfterViewInit(): void {
    this.form.addControl('otp', this.otpControlComponent.control);
  }

  onRequestOtp() {
    this.requestOtp.emit({ email: this.form.get('email').value });
  }

  onFormSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.identifySubmit.emit(this.form.value as IdentifyEvent);
    }
  }
}

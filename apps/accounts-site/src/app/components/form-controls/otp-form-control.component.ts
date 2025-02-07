import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-otp-form-control',
  standalone: true,
  imports: [CommonModule, TuiButton, TextfieldFormControlComponent],
  template: `
    <form-control-textfield [control]="control" label="OTP" icon="@tui.key" [type]="'number'">
      <button
        tuiButton
        appearance="flat"
        size="xs"
        (click)="onRequestOtp()"
        [disabled]="otpResendCountdown !== 0"
      >
        <ng-container *ngIf="otpResendCountdown === 0; else getOtpCountDown">
          Resend OTP
        </ng-container>
        <ng-template #getOtpCountDown>
          {{ this.otpResendCountdown }}
        </ng-template>
      </button>
    </form-control-textfield>
  `,
})
export class OtpFormControlComponent implements OnInit {
  @Output() requestOtp = new EventEmitter<void>();
  @Input() isGetOtpButtonDisable = true;
  otpResendCountdown = 60;

  control = new FormControl('', {
    validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
  });

  ngOnInit(): void {
    this.countDownGetOtp();
  }

  countDownGetOtp() {
    this.otpResendCountdown = this.otpResendCountdown - 1;
    if (this.otpResendCountdown > 0) {
      setTimeout(this.countDownGetOtp, 1000);
    }
  }

  onRequestOtp() {
    this.otpResendCountdown = 60;
    this.countDownGetOtp();
    this.requestOtp.emit();
  }
}

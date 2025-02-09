import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { EbbSiteService } from '@ebizbase/angular-site';
import { WA_LOCATION, WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { AuthenticateService } from '../../core/services/authenticate.service';
import { LifeCycle } from '../../core/services/lifecycle.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiButton,
    TuiButtonLoading,
    TuiButton,
    TextfieldFormControlComponent,
  ],
  host: { class: 'flex flex-col gap-4 w-screen max-w-sm' },
  template: `
    <h1 class="text-2xl font-medium w-full text-center">OTP Verification</h1>
    <form class="flex flex-col gap-2 w-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <form-control-textfield
          [control]="otpControl"
          label="OTP"
          icon="@tui.rectangle-ellipsis"
          [type]="'number'"
          placeholder="Enter OTP code"
        >
          <button
            tuiButton
            appearance="outline"
            size="s"
            (click)="onRequestOtp()"
            [disabled]="otpResendCountdown !== 0"
          >
            {{ otpResendCountdown === 0 ? 'Get OTP' : otpResendCountdown }}
          </button>
        </form-control-textfield>
        <div class="leading-6 text-sm text-gray-600 tracking-wide text-center">
          Check your inbox for our email! If it’s not there, look in your spam/junk folder and mark
          it as ‘Not Spam’ to receive future messages smoothly.
        </div>
        <button tuiButton type="button" [loading]="loading" (click)="onFormSubmit()">Next</button>
      </div>
    </form>
  `,
})
export class VerifyComponent implements OnInit {
  protected loading = false;
  protected form = new FormGroup({
    otp: new FormControl('', {
      validators: [MessageableValidators.required(), MessageableValidators.pattern(/^\d{6}$/)],
    }),
  });
  protected otpControl: FormControl = this.form.get('otp') as FormControl;
  protected otpResendCountdown = 0;
  protected location: Location = inject(WA_LOCATION);
  protected navigator: Navigator = inject(WA_NAVIGATOR);
  protected router: Router = inject(Router);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected domain: EbbDomain = inject(EbbDomain);
  protected iamService: AuthenticateService = inject(AuthenticateService);
  protected dialogService: TuiDialogService = inject(TuiDialogService);
  protected siteService: EbbSiteService = inject(EbbSiteService);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected lifeCycle: LifeCycle = inject(LifeCycle);

  ngOnInit(): void {
    if (!this.lifeCycle.email) {
      console.log('Not in lifecyle');
      this.router.navigate(['/not-found'], { skipLocationChange: true });
    }
  }

  countDownGetOtp() {
    this.otpResendCountdown = this.otpResendCountdown - 1;
    this.cdr.markForCheck();
    if (this.otpResendCountdown > 0) {
      setTimeout(this.countDownGetOtp.bind(this), 1000);
    }
  }

  async onRequestOtp() {
    this.otpResendCountdown = 60;
    this.countDownGetOtp();
    this.iamService.getOtp({ email: this.form.get('email').value }).subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  async onFormSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.iamService
      .verifyHotp({ otp: this.form.get('otp').value, email: this.lifeCycle.email })
      .subscribe({
        next: ({ data }) => {
          if (!data.firstName) {
            this.router.navigate(['onboarding/name'], { queryParamsHandling: 'merge' });
          } else {
            this.location.href =
              this.route.snapshot.queryParams['continue'] ??
              `${this.domain.getUrl(DOMAIN_COMPONENTS.HOME_SITE)}`;
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            if (!this.navigator.onLine) {
              // Mất kết nối internet
              this.dialogService.open('').subscribe();
            } else {
              // Hệ thống có lỗi không thể kết nối được
              this.dialogService.open('').subscribe();
            }
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}

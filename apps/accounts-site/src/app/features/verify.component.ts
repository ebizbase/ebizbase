import { CommonModule, Location as NgLocation } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOMAIN_NAME_COMPONENTS, DomainName, EcommaSite } from '@ebizbase/angular-common';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { ColorMode, Language } from '@ebizbase/common-types';
import { WA_LOCAL_STORAGE, WA_LOCATION, WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiAlertService, TuiButton, TuiDialogService, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiFade } from '@taiga-ui/kit';
import { CURRENT_IDENTITY_STORAGE_KEY } from '../core/constant';
import { APIService } from '../core/services/authenticate.service';

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
    TuiTextfield,
    TuiFade,
  ],
  host: { class: 'flex flex-col gap-4 w-screen max-w-sm' },
  template: `
    <h1 class="text-2xl font-medium w-full text-center">OTP Verification</h1>
    <form class="flex flex-col gap-2 w-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <button
          (click)="onChangeEmail()"
          tuiButton
          appearance="outline"
          iconStart="@tui.mail"
          iconEnd="@tui.refresh-ccw"
          class="w-full !justify-start !font-medium"
          tuiAppearanceMode="checked"
        >
          <span tuiFade class="w-full text-left">{{ currentEmail }}</span>
        </button>

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
export class VerifyComponent implements OnInit, AfterViewInit {
  protected loading = false;
  protected form = new FormGroup({
    otp: new FormControl('', {
      validators: [MessageableValidators.required(), MessageableValidators.pattern(/^\d{6}$/)],
    }),
  });
  protected otpControl: FormControl = this.form.get('otp') as FormControl;
  protected otpResendCountdown = 0;

  private readonly ngLocation: NgLocation = inject(NgLocation);
  protected readonly router: Router = inject(Router);
  private readonly alerts = inject(TuiAlertService);
  private readonly dialog: TuiDialogService = inject(TuiDialogService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  protected domain: DomainName = inject(DomainName);
  protected apiService: APIService = inject(APIService);
  protected siteService: EcommaSite = inject(EcommaSite);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected storage: Storage = inject(WA_LOCAL_STORAGE);
  protected location: Location = inject(WA_LOCATION);
  protected navigator: Navigator = inject(WA_NAVIGATOR);
  protected currentEmail: string | null;

  constructor() {
    this.siteService.title = 'OTP verification';
    this.siteService.metas.set({ description: 'Verify OTP for access Ecomma services' });
  }

  ngOnInit(): void {
    console.log('VerifyComponent initialized');

    const raw = this.storage.getItem(CURRENT_IDENTITY_STORAGE_KEY);
    let currentIdentity: { email?: string; lastGetOtpAt?: number } = {};
    if (raw) {
      try {
        currentIdentity = JSON.parse(raw);
      } catch {
        // do not thing
      }
    }
    this.currentEmail = currentIdentity.email;
    if (!this.currentEmail) {
      this.router.navigate([''], { queryParamsHandling: 'preserve' });
    }

    if (currentIdentity.lastGetOtpAt) {
      const timeLeft = 60 - Math.ceil((Date.now() - currentIdentity.lastGetOtpAt) / 1000);
      if (timeLeft > 0) {
        this.otpResendCountdown = timeLeft;
      }
    }
    if (this.otpResendCountdown > 0) {
      this.countDownGetOtp();
    }
  }

  ngAfterViewInit(): void {
    console.log('VerifyComponent after view initialized');
  }

  protected countDownGetOtp() {
    this.otpResendCountdown = this.otpResendCountdown - 1;
    this.cdr.markForCheck();
    if (this.otpResendCountdown > 0) {
      setTimeout(this.countDownGetOtp.bind(this), 1000);
    }
  }

  protected async onRequestOtp() {
    const language = this.siteService.language() as keyof Language;
    const colorMode = this.siteService.colorMode as keyof ColorMode;
    this.apiService.getOtp({ email: this.currentEmail, language, colorMode }).subscribe({
      next: (response) => {
        this.alerts.open(response.message, { icon: '@tui.circle-check' }).subscribe();
        this.storage.setItem(
          CURRENT_IDENTITY_STORAGE_KEY,
          JSON.stringify({ email: this.currentEmail, lastGetOtpAt: Date.now() + '' })
        );
        this.otpResendCountdown = 60;
        this.countDownGetOtp();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.onNetworkError();
        } else if (error.error && error.error.message) {
          this.dialog.open(error.error.message).subscribe();
        } else {
          this.dialog.open(error.message).subscribe();
        }
      },
    });
  }

  protected async onFormSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.apiService
      .verify({ otp: this.form.get('otp').value, email: this.currentEmail })
      .subscribe({
        next: () => {
          this.loading = false;
          this.storage.removeItem(CURRENT_IDENTITY_STORAGE_KEY);
          this.location.href =
            this.route.snapshot.queryParams['continue'] ??
            this.domain.getUrl(DOMAIN_NAME_COMPONENTS.MY_ACCOUNT_SITE);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          if (error.status === 0) {
            this.onNetworkError();
          } else if (error.error && error.error.message) {
            this.dialog.open(error.error.message).subscribe();
          } else {
            this.dialog.open(error.message).subscribe();
          }
        },
      });
  }

  protected onChangeEmail() {
    this.ngLocation.back();
  }

  protected onNetworkError() {
    if (!this.navigator.onLine) {
      this.dialog.open('Unable to connect to server. Please try again later!').subscribe();
    } else {
      this.dialog.open('Unable to connect to server. Please try again later!').subscribe();
    }
  }
}

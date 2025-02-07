import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { OAuthButtonComponent } from '../components/buttons/oauth.component';
import { IdentifyFormComponent } from '../components/forms/identify-form.component';
import { GetOTPEvent } from '../models/get-otp.event';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-identify-page',
  standalone: true,
  imports: [CommonModule, IdentifyFormComponent, OAuthButtonComponent],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <app-oauth-button
      assetSrc="/images/google.svg"
      alt="Google Logo"
      title="Continue with Google"
    />
    <app-oauth-button
      assetSrc="/images/github.svg"
      alt="Github Logo"
      title="Continue with Github"
    />
    <div class="leading-none px-2 text-center text-sm text-gray-600 tracking-wide font-medium py-3">
      or continue with e-mail
    </div>
    <app-identify-form class="w-full pb-48" (formSubmit)="requestOtp($event)" [loading]="loading" />
  `,
})
export class IdentifyPageComponent {
  @Input() loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(WA_NAVIGATOR) private navigator: Navigator,
    private dialogService: TuiDialogService,
    private router: Router,
    private iamService: AuthenticateService
  ) {}

  async requestOtp(data: GetOTPEvent) {
    this.loading.next(true);
    this.iamService.getOtp(data).subscribe({
      next: () => {
        this.router.navigate(['verify-hotp'], {
          queryParams: data,
          queryParamsHandling: 'merge',
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          if (this.navigator.onLine) {
            this.dialogService.open('Can not connect to server').subscribe();
          } else {
            this.dialogService.open('Check internet connection').subscribe();
          }
        } else if (error.status > 500) {
          this.dialogService.open('Internal Server Error. Please try again later.').subscribe();
        } else if (error.status >= 400) {
          this.dialogService.open('Bad Request. Please check your input.').subscribe();
        }
      },
      complete: () => {
        this.loading.next(false);
      },
    });
  }
}

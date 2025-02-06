import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';
import { WA_LOCATION, WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { VerifyHotpFormComponent } from '../components/forms/verify-hotp-form.component';
import { GetOTPEvent } from '../models/get-otp.event';
import { IdentifyEvent } from '../models/identify.event';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-verify-hotp',
  standalone: true,
  imports: [CommonModule, VerifyHotpFormComponent],
  template: `
    <div class="w-full mx-auto max-w-sm flex-1 mt-8 flex items-center flex-col gap-4">
      <app-verify-htop-form
        (requestOtp)="requestOtp($event)"
        (identifySubmit)="formSubmitted($event)"
        [loading]="loading"
      />
    </div>
  `,
})
export class VerifyHotpPageComponent implements OnInit {
  @Input() loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private email: string;

  constructor(
    @Inject(WA_LOCATION) private location: Location,
    @Inject(WA_NAVIGATOR) private navigator: Navigator,
    private route: ActivatedRoute,
    private domain: EbbDomain,
    private router: Router,
    private iamService: AuthenticateService,
    private dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
  }

  async requestOtp(data: GetOTPEvent) {
    this.iamService.getOtp(data).subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  async formSubmitted({ otp }: IdentifyEvent) {
    this.loading.next(true);
    this.iamService.verifyHotp({ otp, email: this.email }).subscribe({
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
        this.loading.next(false);
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadRequestComponent, SystemUrl } from '@ebizbase/angular-common';
import { WA_LOCATION, WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { MainContainerComponent } from '../components/containers/main.component';
import { VerifyHotpFormComponent } from '../components/forms/verify-hotp-form.component';
import { GetOTPEvent } from '../models/get-otp.event';
import { IdentifyEvent } from '../models/identify.event';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-verify-hotp',
  standalone: true,
  imports: [CommonModule, VerifyHotpFormComponent, MainContainerComponent, BadRequestComponent],
  template: `
    <app-main-container *ngIf="isBadRequest === false">
      <header class="py-6 md:py-0 md:flex-1">
        <h1
          class="text-xl md:text-4xl font-semibold leading-tight text-center md:text-left w-full mb-4"
        >
          OTP Vertification
        </h1>
        <h2 class="md:text-lg w-full text-center md:text-left">Enter your OTP you received</h2>
      </header>
      <main class="md:flex-1">
        <app-verify-htop-form
          (requestOtp)="requestOtp($event)"
          (identifySubmit)="formSubmitted($event)"
          [loading]="loading"
        />
      </main>
    </app-main-container>
    <bad-request-error *ngIf="isBadRequest === true" />
  `,
})
export class VerifyHotpPageComponent implements OnInit {
  @Input() loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private email: string;
  isBadRequest?: boolean;

  constructor(
    @Inject(WA_LOCATION) private location: Location,
    @Inject(WA_NAVIGATOR) private navigator: Navigator,
    private route: ActivatedRoute,
    private systemUrl: SystemUrl,
    private router: Router,
    private iamService: AuthenticateService,
    private dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
    this.isBadRequest = this.email ? false : true;
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
          console.log(this.router.config, this.location, this.systemUrl);
          // this.router.navigate(['onboarding/name'], { queryParamsHandling: 'merge' });
        } else {
          // this.location.href =
          //   this.route.snapshot.queryParams['continue'] ??
          //   `${this.systemUrl.Protocol}//${this.systemUrl.HomeSiteBaseURL}`;
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

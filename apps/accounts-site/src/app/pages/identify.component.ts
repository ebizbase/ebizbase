import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainService } from '@ebizbase/angular-common-service';
import { WA_LOCATION } from '@ng-web-apis/common';
import {
  IdentifyFormComponent,
  IdentifyFormSubmmittedEvent,
  IdentifyGetOTPEvent,
} from '../components/identify-form.component';
import { IamService } from '../services/iam.service';

@Component({
  selector: 'app-identify-page',
  standalone: true,
  imports: [CommonModule, IdentifyFormComponent],
  template: `
    <div class="bg-gray-50 font-[sans-serif] text-[#333]">
      <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <main
          class="max-w-4xl w-full py-12 px-6 md:border md:rounded-3xl md:border-gray-300 md:bg-white md:min-h-80"
        >
          <div class="flex flex-col md:flex-row">
            <div class="w-full">
              <h1 class="text-xl md:text-4xl font-semibold leading-tight w-full mb-4">
                Welcome to NextBON
              </h1>
              <h2 class="md:text-lg leading-tight w-full">Enter your email</h2>
            </div>
            <div class="w-full">
              <app-identify-form
                [isLoading]="isLoading"
                (getOtp)="getOtp($event)"
                (formSubmit)="formSubmitted($event)"
              />
            </div>
          </div>
        </main>
        <footer class="flex max-w-4xl w-full justify-between mt-6">
          <div>
            <p class="text-sm text-gray-500"></p>
          </div>
          <ul class="flex space-x-6">
            <li class="text-sm text-gray-500"><a href="#">Help</a></li>
            <li class="text-sm text-gray-500"><a href="#">Privacy</a></li>
            <li class="text-sm text-gray-500"><a href="#">Terms</a></li>
          </ul>
        </footer>
      </div>
    </div>
  `,
})
export class IdentifyPageComponent {
  isLoading = false;

  constructor(
    @Inject(WA_LOCATION) private location: Location,
    private route: ActivatedRoute,
    private domain: DomainService,
    private iamService: IamService
  ) {}

  async formSubmitted(data: IdentifyFormSubmmittedEvent) {
    this.isLoading = true;
    this.iamService.verifyOtp(data).subscribe({
      next: () => {
        this.location.href =
          this.route.snapshot.queryParams['continue'] ??
          `${this.domain.Protocol}//${this.domain.MyAccountSiteDomain}`;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  async getOtp(data: IdentifyGetOTPEvent) {
    this.iamService.getOtp(data).subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}

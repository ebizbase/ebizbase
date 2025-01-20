import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { BadRequestComponent } from '@ebizbase/angular-common';
import { WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiDialogService } from '@taiga-ui/core';
import { MainContainerComponent } from '../components/containers/main.component';
import { OnboardingNameFormComponent } from '../components/forms/onboarding-name-form.component';
import { OnboardingNameEvent } from '../models/onboarding-name.event';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-onboarding-name-page',
  standalone: true,
  imports: [CommonModule, MainContainerComponent, BadRequestComponent, OnboardingNameFormComponent],
  template: `
    <app-main-container *ngIf="isBadRequest === false">
      <header class="py-6 md:py-0 md:flex-1">
        <h1
          class="text-xl md:text-4xl font-semibold leading-tight text-center md:text-left w-full mb-4"
        >
          Who are you?
        </h1>
        <h2 class="md:text-lg w-full text-center md:text-left">Enter your name</h2>
      </header>
      <main class="md:flex-1">
        <app-onboarding-name-form (formSubmited)="onFormSubmited($event)" />
      </main>
    </app-main-container>
    <bad-request-error *ngIf="isBadRequest === true" />
  `,
})
export class OnboardingNamePageComponent {
  isBadRequest?: boolean;

  constructor(
    @Inject(WA_NAVIGATOR) private navigator: Navigator,
    private dialogService: TuiDialogService,
    private authenticate: AuthenticateService
  ) {
    if (this.authenticate.isLoggedIn) {
      console.log(1);
      this.isBadRequest = true;
    } else {
      this.authenticate.getMyInfo().subscribe({
        next: (response) => {
          if (response.data.firstName) {
            this.isBadRequest = false;
          } else {
            this.isBadRequest = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          if (!this.onGeneralServerErrorResponse(error.status)) {
            this.dialogService.open('Bad Request. Please check your input.').subscribe();
          }
        },
      });
    }
  }

  onFormSubmited(data: OnboardingNameEvent) {
    this.authenticate.updateMyInfo(data).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        if (!this.onGeneralServerErrorResponse(error.status)) {
          this.dialogService.open('Bad Request. Please check your input.').subscribe();
        }
      },
    });
  }

  onGeneralServerErrorResponse(status: number): boolean {
    if (status === 0) {
      if (this.navigator.onLine) {
        this.dialogService.open('Can not connect to server').subscribe();
        return true;
      } else {
        this.dialogService.open('Check internet connection').subscribe();
        return true;
      }
    } else if (status > 500) {
      this.dialogService.open('Internal Server Error. Please try again later.').subscribe();
      return true;
    }
    return false;
  }
}

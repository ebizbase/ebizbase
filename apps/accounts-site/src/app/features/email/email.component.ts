import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { EbbSiteService } from '@ebizbase/angular-site';
import { WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiButton, TuiDialogService, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { AuthenticateService } from '../../core/services/authenticate.service';
import { LifeCycle } from './../../core/services/lifecycle.service';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [
    TuiLink,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    TextfieldFormControlComponent,
  ],
  host: { class: 'flex flex-col gap-4 py-16' },
  template: `
    <!-- HEADHING -->
    <h1 class="w-full text-center text-2xl font-medium">One-Step Secure Access</h1>
    <h2 class="w-full text-center text-base mb-6">
      If you're a new user, an account will be created for you automatically
    </h2>

    <!-- OAuth Buttons -->
    <button
      tuiButton
      appearance="outline"
      class="w-full !justify-start"
      tuiAppearanceMode="checked"
    >
      <div class="bg-white p-2 rounded-full">
        <img class="w-4" src="/images/google.svg" alt="Google Logo" />
      </div>
      <span class="ml-4">Continue with Google</span>
    </button>

    <div
      class="leading-none px-2 text-center text-sm text-gray-600 dark:text-gray-400 tracking-wide py-3"
    >
      or continue with e-mail
    </div>

    <!-- FORM -->
    <form class="flex flex-col gap-2" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <form-control-textfield
          [control]="emailControl"
          [type]="'email'"
          autocomplete="email"
          label="Email"
          icon="@tui.mail"
          placeholder="Enter your email "
        />
        <button tuiButton type="button" (click)="requestOtp()">Next</button>
        <p class="mt-6 text-xs text-gray-600 text-center">
          I agree to abide by ebizbase's <a href="#" tuiLink>Terms of Service</a> and its
          <a href="#" tuiLink>Privacy Policy</a>
        </p>
      </div>
    </form>
  `,
})
export class EmailComponent implements OnInit, AfterViewInit {
  protected form = new FormGroup({
    email: new FormControl('', {
      validators: [MessageableValidators.required(), MessageableValidators.email()],
    }),
  });
  protected emailControl: FormControl = this.form.get('email') as FormControl;
  protected navigator: Navigator = inject(WA_NAVIGATOR);
  protected dialogService: TuiDialogService = inject(TuiDialogService);
  protected router: Router = inject(Router);
  protected authenticateService: AuthenticateService = inject(AuthenticateService);
  protected siteService: EbbSiteService = inject(EbbSiteService);
  protected lifeCycle: LifeCycle = inject(LifeCycle);

  constructor() {
    this.siteService.title = 'One-Step Secure Access';
    this.siteService.metas.set({
      description: 'Sign in to ecoma without password, quick and secure',
    });
  }

  ngOnInit(): void {
    this.lifeCycle.email = undefined;
  }

  ngAfterViewInit(): void {
    const firstInput = document.querySelector('input') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  async requestOtp() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this.lifeCycle.email = this.emailControl.value;
    this.router.navigate(['verify'], {
      skipLocationChange: true,
      queryParamsHandling: 'merge',
    });
  }
}

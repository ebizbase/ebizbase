import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DOMAIN_NAME_COMPONENTS, DomainName, EcommaSite } from '@ebizbase/angular-common';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { WA_LOCAL_STORAGE, WA_NAVIGATOR } from '@ng-web-apis/common';
import { TuiButton, TuiDialogService, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { CURRENT_IDENTITY_STORAGE_KEY } from '../core/constant';
import { AuthenticateService } from '../core/services/authenticate.service';

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
  host: { class: 'flex flex-col gap-4 w-screen max-w-sm' },
  template: `
    <!-- HEADHING -->
    <h1 class="w-full text-center text-2xl font-medium">Secure Access</h1>
    <h2 class="w-full text-center text-base mb-6">New users get an account automatically</h2>

    <!-- OAuth Buttons -->
    <button
      tuiButton
      appearance="outline"
      class="w-full !justify-start"
      tuiAppearanceMode="checked"
      (click)="onLoginWithGoogleAccount()"
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
        <button tuiButton type="button" (click)="onEmailSubmit()">Next</button>
        <p class="mt-6 text-xs text-gray-600 text-center">
          I agree to abide by ebizbase's
          <a href="{{ policiesSiteUrl }}/terms" target="_blank" tuiLink>Terms of Service</a> and its
          <a href="{{ policiesSiteUrl }}/privacy" target="_blank" tuiLink>Privacy Policy</a>
        </p>
      </div>
    </form>
  `,
})
export class AuthenticateComponent implements OnInit, AfterViewInit {
  protected form = new FormGroup({
    email: new FormControl('', {
      validators: [MessageableValidators.required(), MessageableValidators.email()],
    }),
  });
  protected emailControl: FormControl = this.form.get('email') as FormControl;
  protected navigator: Navigator = inject(WA_NAVIGATOR);
  protected storage: Storage = inject(WA_LOCAL_STORAGE);
  protected dialogService: TuiDialogService = inject(TuiDialogService);
  protected router: Router = inject(Router);
  protected authenticateService: AuthenticateService = inject(AuthenticateService);
  protected siteService: EcommaSite = inject(EcommaSite);
  protected currentIdentity: { email?: string } = {};
  protected domain: DomainName = inject(DomainName);

  constructor() {
    this.siteService.title = 'One-Step Secure Access';
    this.siteService.metas.set({
      description: 'Sign in to ecoma without password, quick and secure',
    });
  }

  ngOnInit(): void {
    console.log('EmailComponent initialized');
    const raw = this.storage.getItem(CURRENT_IDENTITY_STORAGE_KEY);
    if (raw) {
      try {
        this.currentIdentity = JSON.parse(raw);
      } catch {
        // do not thing
      }
    }

    this.emailControl.setValue(this.currentIdentity.email);
  }

  ngAfterViewInit(): void {
    console.log('EmailComponent after view initialized');
  }

  async onEmailSubmit() {
    console.log('requestOtp called');
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    console.log('Navigating to verify');
    if (this.emailControl.value !== this.currentIdentity.email) {
      this.storage.setItem(
        CURRENT_IDENTITY_STORAGE_KEY,
        JSON.stringify({ email: this.emailControl.value })
      );
    }
    this.router.navigate(['verify'], { queryParamsHandling: 'preserve' });
  }

  onLoginWithGoogleAccount() {
    this.dialogService
      .open('Feature under construction will be available in next upgrade')
      .subscribe();
  }

  get policiesSiteUrl() {
    return this.domain.getUrl(DOMAIN_NAME_COMPONENTS.POLICIES_SITE);
  }
}

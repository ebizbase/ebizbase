import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDialogService, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiCheckbox } from '@taiga-ui/kit';
import { Subject } from 'rxjs';
import { GetOTPEvent } from '../../models/get-otp.event';
import { EmailFormControlComponent } from '../form-controls/email-form-control.component';

@Component({
  selector: 'app-identify-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
    TuiCheckbox,
    EmailFormControlComponent,
  ],
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <app-email-form-control autocomplete="email" />
        <div class="flex gap-2 items-center">
          <input tuiCheckbox type="checkbox" size="s" formControlName="termsAgreed" />
          <span>I agree to the <a href="#">terms of service</a></span>
        </div>
      </div>
      <div class="flex flex-col gap-8 mt-8 md:justify-end md:flex-row md:items-center">
        <button
          tuiButton
          size="m"
          type="button"
          [loading]="loading | async"
          (click)="onFormSubmit()"
        >
          Next
        </button>
      </div>
    </form>
  `,
})
export class IdentifyFormComponent implements AfterViewInit {
  @Input() loading: Subject<boolean>;
  @Output() formSubmit = new EventEmitter<GetOTPEvent>();

  @ViewChild(EmailFormControlComponent) emailControlComponent: EmailFormControlComponent;

  form: FormGroup;

  constructor(private readonly dialogService: TuiDialogService) {
    this.form = new FormGroup({
      termsAgreed: new FormControl(true),
    });
  }

  ngAfterViewInit(): void {
    this.form.addControl('email', this.emailControlComponent.control);
  }

  onFormSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (!this.form.get('termsAgreed').value) {
        this.dialogService.open('<p>ABC</p>', { label: 'HEADING', size: 's' }).subscribe();
      } else {
        this.formSubmit.emit({ email: this.form.value.email });
      }
    }
  }
}

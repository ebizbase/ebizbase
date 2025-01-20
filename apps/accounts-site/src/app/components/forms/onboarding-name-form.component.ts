import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { OnboardingNameEvent } from '../../models/onboarding-name.event';
import { FirstNameFormControlComponent } from '../form-controls/first-name-form-control.component';
import { LastNameFormControlComponent } from '../form-controls/last-name-form-control.component';

@Component({
  selector: 'app-onboarding-name-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    FirstNameFormControlComponent,
    LastNameFormControlComponent,
  ],
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form">
      <div class="flex flex-col flex-1 gap-4">
        <app-first-name-form-control />
        <app-last-name-form-control />
      </div>
      <div class="flex flex-col gap-8 mt-8 md:justify-end md:flex-row md:items-center">
        <button tuiButton size="m" type="button" (click)="onFormSubmit()">Next</button>
      </div>
    </form>
  `,
})
export class OnboardingNameFormComponent implements AfterViewInit {
  @Input() isLoading = false;
  @Output() formSubmited = new EventEmitter<OnboardingNameEvent>();
  @ViewChild(FirstNameFormControlComponent)
  firstNameControlComponent: FirstNameFormControlComponent;
  @ViewChild(LastNameFormControlComponent) lastNameControlComponent: LastNameFormControlComponent;

  form = new FormGroup({});

  ngAfterViewInit(): void {
    this.form.addControl('firstName', this.firstNameControlComponent.control);
    this.form.addControl('lastName', this.lastNameControlComponent.control);
  }

  onFormSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formSubmited.emit(this.form.value as OnboardingNameEvent);
    }
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EbbAppService } from '@ebizbase/angular-app';
import { MessageableValidators, TextfieldFormControlComponent } from '@ebizbase/angular-form';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-display-name',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiIcon,
    TextfieldFormControlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col bg-[var(--tui-background-base)] rounded-lg lg:col-span-2 border border-[var(--tui-background-neutral-1-hover)] p-4"
    >
      <div class="mb-6 text-gray-700 dark:text-gray-300">
        <p>
          Changes to your name will be reflected across your Ecomma Services. Your previous name may
          still be searchable or appear on old messages. You can use a nickname without having to
          use your real name on your personal documents.
        </p>
      </div>
      <form class="flex flex-col gap-2" [formGroup]="form">
        <div class="flex flex-col flex-1 gap-4">
          <form-control-textfield
            [control]="nameControl"
            autocomplete="name"
            label="Name"
            placeholder="Enter your name"
          />
          <div class="mt-4">
            <div class="font-medium">Who can see your name?</div>
            <div class="mt-4 flex">
              <tui-icon class="mx-3 mt-1" icon="@tui.users" />
              <p class="text-gray-700 dark:text-gray-300">
                Anyone can see this info when they communicate<BR />with you or view content you
                create in Google services.
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-4 mt-10">
            <button
              tuiButton
              class="min-w-28"
              appearance="flat"
              size="m"
              type="button"
              (click)="onNameSubmit()"
            >
              Cancel
            </button>
            <button tuiButton class="min-w-28" type="button" size="m" (click)="onNameSubmit()">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class DisplayNameComponent {
  protected form = new FormGroup({
    name: new FormControl('', {
      validators: [MessageableValidators.required(), MessageableValidators.maxLength(40)],
    }),
  });
  protected nameControl: FormControl = this.form.get('name') as FormControl;

  constructor(private app: EbbAppService) {
    this.app.pageInfo = {
      title: 'Display name',
      contentSize: 'm',
      heading: {
        title: 'Display name',
        previous: './',
      },
    };
  }

  onNameSubmit() {
    throw new Error('Method not implemented.');
  }
}

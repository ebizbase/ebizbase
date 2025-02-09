import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbColorModeSwitcher } from '@ebizbase/angular-site';
import LanguageSelectComponent from '../../shared/language-select.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, EbbColorModeSwitcher, LanguageSelectComponent],
  selector: 'app-main-layout',
  host: {
    class: '"w-screen flex flex-col',
  },
  template: `
    <div class="min-h-screen w-screen bg-[var(--tui-background-base-alt)] flex justify-center">
      <div class="flex flex-col justify-center max-w-2xl mx-auto min-h-screen">
        <img class="h-5 my-10" src="/images/logo.svg" alt="Logo" />
        <div
          class="bg-[var(--tui-background-base-alt)] sm:bg-[var(--tui-background-base)] sm:rounded-lg flex-1 sm:flex-initial"
        >
          <div class="p-6 sm:p-12">
            <router-outlet></router-outlet>
          </div>
        </div>
        <div class="flex justify-between py-4 px-6 sm:px-0">
          <app-language-select class="min-w-32" />
          <ebb-site-color-mode-switcher />
        </div>
      </div>
    </div>
  `,
})
export class MailLayoutComponent {}

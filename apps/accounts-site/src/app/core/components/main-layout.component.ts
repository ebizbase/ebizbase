import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbColorModeSwitcher } from '@ebizbase/angular-site';

@Component({
  standalone: true,
  imports: [RouterOutlet, EbbColorModeSwitcher],
  selector: 'app-main-layout',
  host: {
    class: '"w-screen flex flex-col',
  },
  template: `
    <header class="w-full bg-[var(--tui-background-base-alt)] h-16">
      <div
        class="flex w-full h-full max-w-screen-lg px-8 justify-between items-center mx-auto bg-[var(--tui-background-base-alt)]"
      >
        <img class="h-4" src="/images/logo.svg" alt="Logo" />
        <div class="flex items-center">
          <ebb-site-color-mode-switcher class="h-8" />
        </div>
      </div>
    </header>
    <main
      class="flex-1 h-[calc(100dvh-4rem)] flex flex-col w-full px-8 justify-center items-center"
    >
      <div class="max-w-xl w-full">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
})
export class MailLayoutComponent {}

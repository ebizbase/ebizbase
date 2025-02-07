import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbColorModeSwitcher, EbbSite } from '@ebizbase/angular-site';

@Component({
  standalone: true,
  imports: [EbbSite, RouterOutlet, EbbColorModeSwitcher],
  selector: 'app-root',
  template: `
    <ebb-site>
      <div class="w-screen min-h-screen flex flex-col">
        <header class="w-full bg-[var(--tui-background-base-alt)] h-16">
          <div
            class="flex w-full h-full max-w-screen-xl px-8 justify-between items-center mx-auto bg-[var(--tui-background-base-alt)]"
          >
            <div class="flex items-center">
              <img class="h-5" src="/images/logo.svg" alt="Logo" />
              <span
                class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
                >comma</span
              >
            </div>
            <div class="flex items-center">
              <button
                class="h-8 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400"
              ></button>
              <ebb-site-color-mode-switcher class="h-8" />
            </div>
          </div>
        </header>
        <main
          class="flex-1 h-[calc(100dvh-4rem)] flex flex-col w-full px-8 justify-center items-center"
        >
          <div class="max-w-lg w-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </ebb-site>
  `,
})
export class AppComponent {}

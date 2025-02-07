import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="w-screen min-h-screen flex">
      <div
        class="md:max-w-2xl md:w-2/5 w-full sm:p-12 p-6 !pt-0 flex flex-col justify-center items-center mx-auto"
      >
        <a href="#" class="flex items-center">
          <img class="h-5" src="/images/logo.svg" alt="Logo" />
          <span class="ml-0.5 text-xl font-semibold text-gray-600 dark:text-gray-400 tracking-wide"
            >comma</span
          >
        </a>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {}

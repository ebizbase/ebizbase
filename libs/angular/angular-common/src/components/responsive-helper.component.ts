import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'responsive-helper',
  template: `
    <div
      class="fixed bottom-20 right-5 hidden rounded-md bg-red-500 py-1 px-3 align-middle text-sm font-medium text-white sm:block"
    >
      <span class="sm:hidden">xs</span>
      <span class="hidden sm:block md:hidden">sm</span>
      <span class="hidden md:block lg:hidden">md</span>
      <span class="hidden lg:block xl:hidden">lg</span>
      <span class="hidden xl:block 2xl:hidden">xl</span>
      <span class="hidden 2xl:block">2xl</span>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ResponsiveHelperComponent {}

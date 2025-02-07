import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbAssetBg, EbbAssetSrc } from '@ebizbase/angular-asset';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, EbbAssetSrc, EbbAssetBg],
  template: `
    <div class="w-screen min-h-screen bg-gray-50 text-gray-900 flex">
      <div class="md:max-w-2xl md:w-2/5 w-full sm:p-12 p-6 !pt-0 flex flex-col justify-center">
        <img class="h-9 mx-auto" [ebbAssetSrc]="'images/logos/wordmark.svg'" alt="Logo" />
        <router-outlet></router-outlet>
      </div>
      <div class="flex-1 bg-indigo-100 text-center hidden md:flex">
        <div
          [ebbAssetBg]="'images/auth/banner.svg'"
          class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
        ></div>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {}

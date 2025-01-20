import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import MainFooterComponent from '../footers/main.component';
import LanguageSelectComponent from '../selects/language.component';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule, MainFooterComponent, LanguageSelectComponent],
  template: `
    <div class="min-h-screen flex flex-col p-6 items-center justify-center">
      <section
        class="md:bg-white w-full max-w-4xl flex-1 md:border md:p-10 lg:p-12 md:flex md:rounded-2xl md:shadow md:flex-initial"
      >
        <ng-content select="header"></ng-content>
        <ng-content select="main"></ng-content>
      </section>
      <footer class="flex max-w-4xl w-full justify-between items-center mt-12 md:mt-4">
        <app-language-select class="w-32" />
        <app-main-footer class="flex items-center space-x-4" />
      </footer>
    </div>
  `,
})
export class MainContainerComponent {}

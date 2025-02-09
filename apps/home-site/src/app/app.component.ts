import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EcommaRoot } from '@ebizbase/angular-common';
@Component({
  standalone: true,
  imports: [EcommaRoot, RouterOutlet],
  selector: 'app-root',
  template: `
    <ecomma-root>
      <router-outlet></router-outlet>
    </ecomma-root>
  `,
})
export class AppComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EbbSite } from '@ebizbase/angular-site';

@Component({
  standalone: true,
  imports: [EbbSite, RouterOutlet],
  selector: 'app-root',
  template: `
    <ebb-site>
      <router-outlet />
    </ebb-site>
  `,
})
export class AppComponent {}

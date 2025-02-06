import { Route } from '@angular/router';
import { NotFoundComponent } from '@ebizbase/angular-common';
import { MainLayoutComponent } from './components/layouts/main.component';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/identify',
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'identify',
        loadComponent: () =>
          import('./pages/identify.component').then((c) => c.IdentifyPageComponent),
      },
      {
        path: 'verify-hotp',
        loadComponent: () =>
          import('./pages/verify-hotp.component').then((c) => c.VerifyHotpPageComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => NotFoundComponent,
  },
];

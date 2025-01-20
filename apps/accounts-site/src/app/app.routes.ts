import { Route } from '@angular/router';
import { NotFoundComponent } from '@ebizbase/angular-common';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/identify',
  },
  {
    path: 'identify',
    loadComponent: () => import('./pages/identify.component').then((c) => c.IdentifyPageComponent),
  },
  {
    path: 'verify-hotp',
    loadComponent: () =>
      import('./pages/verify-hotp.component').then((c) => c.VerifyHotpPageComponent),
  },
  {
    path: 'onboarding/name',
    loadComponent: () =>
      import('./pages/onboarding-name.component').then((c) => c.OnboardingNamePageComponent),
  },
  {
    path: '**',
    loadComponent: () => NotFoundComponent,
  },
];

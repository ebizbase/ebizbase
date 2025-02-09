import { Route } from '@angular/router';
import { UnauthenticatedGuard } from './core/guard/unauthenticated.guard';
export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [UnauthenticatedGuard],
    loadComponent: () =>
      import('./core/components/main-layout.component').then((c) => c.MailLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/authenticate.component').then((c) => c.AuthenticateComponent),
      },
      {
        path: 'verify',
        loadComponent: () => import('./features/verify.component').then((c) => c.VerifyComponent),
      },
    ],
  },
  {
    path: 'bad-request',
    loadComponent: () =>
      import('./features/bad-request-error.component').then((c) => c.BadRequestErrorComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found-error.component').then((c) => c.NotFoundErrorComponent),
  },
];

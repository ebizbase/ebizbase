import { Route } from '@angular/router';
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/main-layout.component').then((c) => c.MailLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/email/email.component').then((c) => c.EmailComponent),
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./features/verify/verify.component').then((c) => c.VerifyComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/not-found.component').then((c) => c.NotFoundComponent),
  },
];

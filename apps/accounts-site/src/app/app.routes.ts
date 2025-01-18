import { Route } from '@angular/router';
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/identify.component').then((c) => c.IdentifyPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page.component').then((c) => c.NotFoundPageComponent),
  },
];

import { Route } from '@angular/router';
import { AuthenticatedGuard } from './core/guads/authenticated.guard';
export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    loadComponent: () =>
      import('./core/components/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/personal-info',
      },
      {
        path: 'personal-info',
        loadComponent: () =>
          import('./pages/personal-info/personal-info.component').then(
            (m) => m.PersonalInfoComponent
          ),
      },
      {
        path: 'personal-info/display-name',
        loadComponent: () =>
          import('./pages/personal-info/display-name.component').then(
            (m) => m.DisplayNameComponent
          ),
      },
      {
        path: 'personal-info/avatar',
        loadComponent: () =>
          import('./pages/personal-info/avatar.component').then((m) => m.AvatarComponent),
      },
      {
        path: 'personal-info/color-mode',
        loadComponent: () =>
          import('./pages/personal-info/color-mode.component').then((m) => m.ColorModeComponent),
      },
      {
        path: 'personal-info/language',
        loadComponent: () =>
          import('./pages/personal-info/language.component').then((m) => m.LanguageComponent),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./pages/security/security.component').then((m) => m.SecurityComponent),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
      },
    ],
  },
];

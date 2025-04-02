import { Routes } from '@angular/router';
import { Notfound } from './shared/not-found/not-found.component';
import { LoginComponent } from './admin-panel/login/login.component';
import { ResetPasswordComponent } from './admin-panel/reset-password/reset-password.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { NotAuthorized } from './shared/not-authorized/not-authorized.component';

export const routes: Routes = [
  { path: '', redirectTo: '/bcms-admin', pathMatch: 'full' },
  {
    path: 'bcms-admin',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin-panel/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      {
        path: 'articles',
        loadComponent: () => import('./admin-panel/articles/articles-list.component').then((m) => m.ArticlesComponent)
      },
      {
        path: 'articles/new',
        loadComponent: () => import('./admin-panel/articles/edit-article/edit-article.component').then((m) => m.EditArticleComponent)
      },
      {
        path: 'articles/:id/edit',
        loadComponent: () => import('./admin-panel/articles/edit-article/edit-article.component').then((m) => m.EditArticleComponent)
      },
      { path: 'pages', loadComponent: () => import('./admin-panel/pages/pages-list.component').then((m) => m.PagesListComponent) },
      {
        path: 'pages/new',
        loadComponent: () => import('./admin-panel/pages/edit-page/edit-page.component').then((m) => m.EditPageComponent)
      },
      {
        path: 'pages/:id/edit',
        loadComponent: () => import('./admin-panel/pages/edit-page/edit-page.component').then((m) => m.EditPageComponent)
      },
      { path: 'users', loadComponent: () => import('./admin-panel/users/users-list.component').then((m) => m.UsersListComponent) },
      {
        path: 'users/new',
        loadComponent: () => import('./admin-panel/users/edit-user/edit-user.component').then((m) => m.EditUserComponent)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./admin-panel/users/edit-user/edit-user.component').then((m) => m.EditUserComponent)
      },
      { path: 'media', loadComponent: () => import('./admin-panel/media/media.component').then((m) => m.MediaComponent) },
      { path: 'settings', loadComponent: () => import('./admin-panel/settings/settings.component').then((m) => m.SettingsComponent) }
    ]
  },
  { path: 'not-found', component: Notfound },
  { path: 'not-authorized', component: NotAuthorized },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/not-found' }
];

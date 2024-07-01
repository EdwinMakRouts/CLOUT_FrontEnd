import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './core/guards/can-activate.guard';

const routes: Routes = [
  {
    path: 'register',
    title: 'Clout - Registro',
    loadChildren: () =>
      import('./features/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    title: 'Clout - Iniciar sesión',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '',
    canActivate: [CanActivateGuard],
    title: 'Clout',
    loadChildren: () =>
      import('./features/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'post/:id',
    canActivate: [CanActivateGuard],
    loadChildren: () =>
      import('./features/post/post.module').then((m) => m.PostPageModule),
  },
  {
    path: 'welcome',
    title: 'Clout - Bienvenido',
    loadChildren: () =>
      import('./features/landing/landing.module').then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: 'not-found',
    title: 'Clout - Página no encontrada',
    loadChildren: () =>
      import('./features/not-found/not-found.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
  {
    path: 'chat',
    canActivate: [CanActivateGuard],
    title: 'Clout - Lista de chats',
    loadChildren: () =>
      import('../app/features/chats/chats.module').then(
        (m) => m.ChatsPageModule
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },  {
    path: 'chat',
    loadChildren: () => import('./features/chat/chat.module').then( m => m.ChatPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

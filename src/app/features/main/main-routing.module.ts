import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        title: 'Clout',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'calendar',
        title: 'Clout - Calendario',
        loadChildren: () =>
          import('../calendar/calendar.module').then(
            (m) => m.CalendarPageModule
          ),
      },
      {
        path: 'profile',
        title: 'Clout - Perfil',
        loadChildren: () =>
          import('../main-profile/main-profile.module').then(
            (m) => m.MainProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'search',
        title: 'Clout - Buscar',
        loadChildren: () =>
          import('../search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: 'chat',
        title: 'Clout - Chats',
        loadChildren: () =>
          import('../chats/chats.module').then((m) => m.ChatsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}

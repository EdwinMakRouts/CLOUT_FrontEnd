import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
  {
    path: 'settings',
    title: 'Clout - Ajustes de perfil',
    loadChildren: () =>
      import('../profile-settings/profile-settings.module').then(
        (m) => m.ProfileSettingsPageModule
      ),
  },
  {
    path: 'following',
    loadChildren: () =>
      import('../profile-following/profile-following.module').then(
        (m) => m.ProfileFollowingPageModule
      ),
  },
  {
    path: 'likes',
    title: 'Clout - Me gusta',
    loadChildren: () =>
      import('../liked-outfits/liked-outfits.module').then(
        (m) => m.LikedOutfitsPageModule
      ),
  },
  {
    path: 'comments',
    title: 'Clout - Mis comentarios',
    loadChildren: () =>
      import('../my-comments/my-comments.module').then(
        (m) => m.MyCommentsPageModule
      ),
  },
  {
    path: 'posts',
    title: 'Clout - Mis publicaciones',
    loadChildren: () =>
      import('../my-posts/my-posts.module').then((m) => m.MyPostsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

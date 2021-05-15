import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AdminsComponent } from '../admins/admins.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component'
import { PostPage } from '../post/post.page';

// Banned and Maintenance page are not accessible from routes.
const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'admins',
    component: AdminsComponent
  },
  {
    path: 'off/:postId',
    component: PostPage
  },
  {
    path: 'prg/:postId',
    component: PostPage
  },
  {
    path: 'mus/:postId',
    component: PostPage
  },
  {
    path: 'cin/:postId',
    component: PostPage
  },
  {
    path: 'sci/:postId',
    component: PostPage
  },
  {
    path: 'his/:postId',
    component: PostPage
  },
  {
    path: 'pol/:postId',
    component: PostPage
  },
  {
    path: 'art/:postId',
    component: PostPage
  },
  {
    path: 'nor/:postId',
    component: PostPage
  },
  {
    path: 'uff/:postId',
    component: PostPage
  },
  {
    path: 'anm/:postId',
    component: PostPage
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}

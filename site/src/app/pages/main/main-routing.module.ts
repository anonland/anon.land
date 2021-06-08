import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './main.page';

// Banned and Maintenance page are not accessible from routes.
const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: ':category',
    component: MainPage
  },
  {
    path: ':category/:postId',
    loadChildren: () => import('../post/post.module').then(m => m.PostPageModule)
  },
  {
    path: ':category/:postId/:commentId',
    loadChildren: () => import('../post/post.module').then(m => m.PostPageModule)
  },
  {
    path: 'cpanel',
    loadChildren: () => import('../cpanel/cpanel.module').then(m => m.CpanelPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }

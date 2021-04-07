import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPostPage } from './new-post.page';

const routes: Routes = [
  {
    path: '',
    component: NewPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPostPageRoutingModule {}

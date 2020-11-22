import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewVoxPage } from './new-vox.page';

const routes: Routes = [
  {
    path: '',
    component: NewVoxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewVoxPageRoutingModule {}

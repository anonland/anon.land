import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoxPage } from './vox.page';

const routes: Routes = [
  {
    path: '',
    component: VoxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoxPageRoutingModule {}

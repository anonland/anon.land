import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CpanelPage } from './cpanel.page';

const routes: Routes = [
  {
    path: '',
    component: CpanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CpanelPageRoutingModule {}

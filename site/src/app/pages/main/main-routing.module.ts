import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AdminsComponent } from '../admins/admins.component';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  }, {
    path: 'admins',
    component: AdminsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}

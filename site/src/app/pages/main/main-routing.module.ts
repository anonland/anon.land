import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AdminsComponent } from '../admins/admins.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component'

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
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}

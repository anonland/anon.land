import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'category/General',
    pathMatch: 'full'
  },
  {
    path: 'category/:id',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },  {
    path: 'new-vox',
    loadChildren: () => import('./new-vox/new-vox.module').then( m => m.NewVoxPageModule)
  },
  {
    path: 'vox',
    loadChildren: () => import('./vox/vox.module').then( m => m.VoxPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { NewVoxPageRoutingModule } from './new-vox-routing.module';

import { NewVoxPage } from './new-vox.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NewVoxPageRoutingModule
  ],
  declarations: [NewVoxPage]
})
export class NewVoxPageModule {}

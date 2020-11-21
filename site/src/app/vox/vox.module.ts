import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoxPageRoutingModule } from './vox-routing.module';

import { VoxPage } from './vox.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoxPageRoutingModule
  ],
  declarations: [VoxPage]
})
export class VoxPageModule {}

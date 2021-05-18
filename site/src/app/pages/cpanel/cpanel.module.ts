import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpanelPageRoutingModule } from './cpanel-routing.module';

import { CpanelPage } from './cpanel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CpanelPageRoutingModule
  ],
  declarations: [CpanelPage]
})
export class CpanelPageModule {}

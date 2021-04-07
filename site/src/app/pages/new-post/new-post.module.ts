import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { NewPostPageRoutingModule } from './new-post-routing.module';

import { NewPostPage } from './new-post.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NewPostPageRoutingModule
  ],
  declarations: [NewPostPage]
})
export class NewPostPageModule {}

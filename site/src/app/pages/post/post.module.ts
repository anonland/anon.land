import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import { TimestampToDatePipe } from 'src/app/pipes/timestamp-to-date.pipe';
import { BypassSanitizerPipe } from 'src/app/pipes/bypass-sanitizer.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule
  ],
  declarations: [
    PostPage,
    TimestampToDatePipe,
    BypassSanitizerPipe
  ]
})
export class PostPageModule { }

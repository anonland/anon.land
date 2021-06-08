import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { PostPageModule } from './pages/post/post.module';
import { ColorSchemeModalComponent } from './components/color-scheme-modal/color-scheme-modal.component';
import { CommentOptionsComponent } from './components/comment-options/comment-options.component';
import { PostOptionsComponent } from './components/post-options/post-options.component';
import { NewPostPage } from './pages/new-post/new-post.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportsPreviewComponent } from './components/reports-preview/reports-preview.component';
import { NotificationsPreviewComponent } from './components/notifications-preview/notifications-preview.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    HttpClientModule,
    PostPageModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [
    AppComponent,
    CommentOptionsComponent,
    PostOptionsComponent,
    NewPostPage,
    ColorSchemeModalComponent,
    ReportsPreviewComponent,
    NotificationsPreviewComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  entryComponents: [
    ColorSchemeModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

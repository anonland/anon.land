import { Component, NgModule, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { ModalController } from '@ionic/angular';
import { ColorSchemeModalComponent } from './components/color-scheme-modal/color-scheme-modal.component';

import { ColorSchemeService } from './services/color-scheme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'General',
      url: '/off',
      icon: 'grid'
    },
    {
      title: 'Preguntas',
      url: '/prg',
      icon: 'help'
    },
    {
      title: 'Música',
      url: '/mus',
      icon: 'musical-notes'
    },
    {
      title: 'Cine',
      url: '/cin',
      icon: 'videocam'
    },
    {
      title: 'Ciencia y tecnología',
      url: '/sci',
      icon: 'terminal'
    },
    {
      title: 'Historia',
      url: '/his',
      icon: 'book'
    },
    {
      title: 'Política',
      url: '/pol',
      icon: 'megaphone'
    },
    {
      title: 'Arte',
      url: '/art',
      icon: 'brush'
    },
    {
      title: 'Normie',
      url: '/nor',
      icon: 'walk'
    },
    {
      title: 'Random',
      url: '/uff',
      icon: 'dice'
    },
    {
      title: 'Anime',
      url: '/anm',
      icon: 'transgender'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authServ: AuthService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private theme: ColorSchemeService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname;
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  async googleSignin() {
    await this.authServ.googleSignin()
      .then(_ => this.toastCtrl.create({
        header: 'Sesión iniciada correctamente', position: 'top', duration: 4000
      }).then(toast => toast.present()))
      .catch(_ => this.toastCtrl.create({
        header: 'No tenes permisos de moderación', position: 'top', duration: 4000
      }).then(toast => toast.present()));
  }

  async googleSignout() {
    await this.authServ.signOut();
  }

  // Color Scheme Changer function.
  async changeColorScheme() {
    const modal = await this.modalCtrl.create({
      component: ColorSchemeModalComponent,
      cssClass: 'color-scheme-changer-modal',
    });
    await modal.present();
  }
}

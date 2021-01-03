import { Component, NgModule, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { ModalController } from '@ionic/angular';
import { ColorSchemeModalPage } from './pages/color-scheme-modal/color-scheme-modal.component';

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
      title: '/off/',
      url: '',
      icon: 'grid'
    },
    {
      title: '/prg/',
      url: '/prg',
      icon: 'help'
    },
    {
      title: '/mus/',
      url: '/mus',
      icon: 'musical-notes'
    },
    {
      title: '/cin/',
      url: '/cin',
      icon: 'videocam'
    },
    {
      title: '/sci/',
      url: '/sci',
      icon: 'telescope'
    },
    {
      title: '/pol/',
      url: '/pol',
      icon: 'megaphone'
    },
    {
      title: '/art/',
      url: '/art',
      icon: 'brush'
    },
    {
      title: '/nor/',
      url: '/nor',
      icon: 'walk'
    },
    {
      title: '/uff/',
      url: '/uff',
      icon: 'dice'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authServ: AuthService,
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
  async chageColorScheme() {
    const modal = await this.modalCtrl.create({
      component: ColorSchemeModalPage,
      cssClass: 'color-scheme-changer-modal',
    });
    await modal.present();
  }
}

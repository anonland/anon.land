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
      title: 'General',
      url: '',
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
      title: 'Películas',
      url: '/pel',
      icon: 'videocam'
    },
    {
      title: 'Ciencia',
      url: '/cie',
      icon: 'telescope'
    },
    {
      title: 'Arte',
      url: '/art',
      icon: 'brush'
    },
    {
      title: 'Programación',
      url: '/pro',
      icon: 'code'
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

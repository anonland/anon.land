import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
    private statusBar: StatusBar
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
}

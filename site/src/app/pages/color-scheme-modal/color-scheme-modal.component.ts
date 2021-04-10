import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ColorSchemeService } from '../../services/color-scheme.service';
import { Storage } from '@ionic/storage';

// Themes.
const themes = {
  normal: {
    primary: '#8414FF',
    secondary: '#A55CF6',
    tertiary: '#DEEFB7',
    success: '#2dd36f',
    warning: '#F29559',
    danger: '#eb445a',
    light: '#FEFFFC',
    medium: '#D8D7D6',
    dark: '#270250'
  },

  redpilled: {
    primary: '#FF3E14',
    secondary: '#61a0af',
    tertiary: '#f5d491',
    success: '#21cf3f',
    warning: '#FFD911',
    danger: '#FF1167',
    light: '#FEFFFC',
    medium: '#D8D7D6',
    dark: '#550101'
  },
  dexov: {
    primary: '#2d6fbd',
    secondary: '#055999',
    tertiary: '#356285',
    success: '#0AB24D',
    warning: '#FFD911',
    danger: '#eb445a',
    light: '#FEFFFC',
    medium: '#D8D7D6',
    dark: '#012646'
  },
  verza: {
    primary: '#4fff75',
    secondary: '#57c66f',
    tertiary: '#E0C6F5',
    success: '#22CA7A',
    warning: '#FFD911',
    danger: '#FF1167',
    light: '#FEFFFC',
    medium: '#D8D7D6',
    dark: '#013500'
  },
  aisatsana: {
    primary: '#EA7191',
    secondary: '#F58874',
    tertiary: '#798474',
    success: '#58C07A',
    warning: '#fAD934',
    danger: '#CA3116',
    light: '#F1EDEE',
    medium: '#D8D7D6',
    dark: '#04100a'
  },
  ambar: {
    primary: '#f5b834',
    secondary: '#79A2AB',
    tertiary: '#E7CEE3',
    success: '#58C07A',
    warning: '#fAD934',
    danger: '#CA3116',
    light: '#F1EDEE',
    medium: '#D8D7D6',
    dark: '#04100a'
  }
};

// Scene.
const scene = {
  day: {
    bgColor: '#FFFFFF',
    color: '#000000',
    toolbarBg: '#F4F4F4',
    toolbarTxt: '#222222',
    itemBg: '#EEEEEE',
    itemTxt: '#555555'
  },

  night: {
    bgColor: '#000000',
    color: '#FFFFFF',
    toolbarBg: '#222222',
    toolbarTxt: '#F4F4F4',
    itemBg: '#444444',
    itemTxt: '#EEEEEE'
  }
};

@Component({
  selector: 'app-color-scheme-modal',
  templateUrl: './color-scheme-modal.component.html',
  styleUrls: ['./color-scheme-modal.component.scss'],
})

export class ColorSchemeModalPage implements OnInit {

  constructor(private modalCtrl: ModalController,
              private theme: ColorSchemeService,
              private storage: Storage
  ) {  }

  // TODO: improve the set theme function and avoid boilerplate code.
  // Defaults options.
  public sceneName = 'day';

  public themeValue: string;
  public sceneValue: boolean;

  ngOnInit() {
    this.getThemeValue();
    this.getSceneValue();
  }

  getThemeValue() {
    this.storage.get('themeName').then(value => {
      if (value == null) {
        this.themeValue = 'normal';
      } else {
        this.themeValue = value;
      }
    });
  }

  getSceneValue() {
    this.storage.get('sceneStatus').then(value => {
      if (value == null) {
        this.sceneValue = false;
      } else {
        this.sceneValue = value;
      }
    });
  }

  // Switch scene mode between day and night.
  setScene(event) {
    const status = event.detail.checked;
    if (status) {
      this.sceneName = 'night';
    } else {
      this.sceneName = 'day';
    }
    this.theme.setTheme(themes[this.themeValue], scene[this.sceneName]);
    this.storage.set('sceneStatus', JSON.stringify(status));
  }

  // Change color scheme.
  setTheme(themeName: string) {
    this.themeValue = themeName;
    this.theme.setTheme(themes[this.themeValue], scene[this.sceneName]);
    this.storage.set('themeName', this.themeValue);
  }

  // Close modal.
  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}

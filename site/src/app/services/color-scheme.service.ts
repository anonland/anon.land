import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as Color from 'color';
import { Storage } from '@ionic/Storage';

@Injectable({
  providedIn: 'root'
})

export class ColorSchemeService {
  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private storage: Storage
  ) {
    storage.get('theme').then(cssText => {
      this.setGlobalCSS(JSON.parse(cssText));
    });
  }

  // Override all global variables with a new theme
  setTheme(theme, scene) {
    const cssText = themeGenerator(theme, scene);
    this.setGlobalCSS(cssText);
    this.storage.set('theme', JSON.stringify(cssText));
  }

  // Define a single CSS variable
  setVariable(name, value) {
    this.document.documentElement.style.setProperty(name, value);
  }

  setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }
}

function themeGenerator(colors, scene) {
  colors = {...colors};
  scene = {...scene};

  const {
    primary,
    secondary,
    tertiary,
    success,
    warning,
    danger,
    dark,
    medium,
    light
  } = colors;

  const {
    bgColor,
    color,
    toolbarBg,
    toolbarTxt,
    itemBg,
    itemTxt,
  } = scene;

  const shadeRatio = 0.47;
  const tintRatio = 0.4;

  return `
  --ion-color-primary: ${primary };
  --ion-color-primary-contrast: ${contrast(primary)};
  --ion-color-primary-shade: ${Color(primary).darken(shadeRatio)};
  --ion-color-primary-tint: ${Color(primary).lighten(tintRatio)};

  --ion-color-secondary: ${secondary};
  --ion-color-secondary-contrast: ${contrast(secondary)};
  --ion-color-secondary-shade: ${Color(secondary).darken(shadeRatio)};
  --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};

  --ion-color-tertiary: ${tertiary}; };
  --ion-color-tertiary-contrast: ${contrast(tertiary)};
  --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
  --ion-color-tertiary-tint: ${Color(tertiary).lighten(tintRatio)};

  --ion-color-success: ${success};
  --ion-color-success-contrast: ${contrast(success)};
  --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
  --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

  --ion-color-warning: ${warning};
  --ion-color-warning-contrast: ${contrast(warning)};
  --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
  --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

  --ion-color-danger: ${danger};
  --ion-color-danger-contrast: ${contrast(danger)};
  --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
  --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

  --ion-color-dark: ${dark};
  --ion-color-dark-contrast: ${contrast(dark)};
  --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
  --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

  --ion-color-medium: ${medium};
  --ion-color-medium-contrast: ${contrast(medium)};
  --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
  --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

  --ion-color-light: ${light};
  --ion-color-light-contrast: $${contrast(light)};
  --ion-color-light-contrast-rgb: 0,0,0;
  --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
  --ion-color-light-tint: ${Color(light).lighten(tintRatio)};

  --ion-background-color: ${bgColor};
  --ion-text-color: ${color};
  --ion-toolbar-background-color: ${toolbarBg};
  --ion-toolbar-text-color: ${toolbarTxt};
  --ion-item-background-color: ${itemBg};
  --ion-item-text-color: ${itemTxt};

  `;
}

function contrast(color, ratio = 0.8) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}

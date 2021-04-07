import { Component, OnInit, ViewChild  } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  public isDown = false;

  constructor() { }

  ngOnInit() { }

  goToTop() {
    this.content.scrollToTop();
  }
}

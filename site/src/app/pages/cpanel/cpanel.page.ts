import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cpanel',
  templateUrl: './cpanel.page.html',
  styleUrls: ['./cpanel.page.scss'],
})
export class CpanelPage implements OnInit {
  public moderator = 'Adonai';
  
  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Anon Land | Administración');
  }

}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements OnInit {

    constructor(
      private title: Title,
    ) {}

  ngOnInit() {
    this.title.setTitle('Administración');
  }

}

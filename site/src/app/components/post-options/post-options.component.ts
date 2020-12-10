import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-post-options',
  templateUrl: './post-options.component.html',
  styleUrls: ['./post-options.component.scss'],
})
export class PostOptionsComponent implements OnInit {
  postId: string;

  constructor(private http: HttpClient, private toastCtrl: ToastController) { }

  ngOnInit() { }

  report() {
    this.http.post('http://localhost:3000/report', { postID: this.postId }, { responseType: 'text' }).subscribe(async () => {
      const toast = await this.toastCtrl.create({ header: 'Post reportado correctamente', position: 'top' });
      await toast.present();
    });
  }
}

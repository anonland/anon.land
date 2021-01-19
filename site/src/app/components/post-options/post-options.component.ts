import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-post-options',
  templateUrl: './post-options.component.html',
  styleUrls: ['./post-options.component.scss'],
})
export class PostOptionsComponent implements OnInit {
  postId: string;

  constructor(private http: HttpClient, private toastCtrl: ToastController, storage: Storage) { }

  ngOnInit() { }

  report() {
    this.http.post('http://localhost:3000/report', { postID: this.postId }, { responseType: 'text' })
      .subscribe(async () => {
        const toast = await this.toastCtrl.create({ header: 'El post fue reportado.', position: 'top' });
        await toast.present();
      });
  }

  hide() {
    const post = (document.querySelector(`#post-${this.postId}`) as HTMLElement);
    const hidden = (document.querySelector(`#post-${this.postId} > .hidden`) as HTMLElement);
    const img = (document.querySelector(`#post-${this.postId} > .image`) as HTMLElement);

    post.style.background = 'black';
    post.style.cursor = 'none';
    post.style.pointerEvents = 'none';
    post.style.borderRadius = 'none';

    hidden.style.display = 'flex';

    img.style.display = 'none';
  }

  saveHide(postId: string) {

  }
}

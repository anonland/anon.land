import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-comment-options',
  templateUrl: './comment-options.component.html',
  styleUrls: ['./comment-options.component.scss'],
})
export class CommentOptionsComponent implements OnInit {
  commentId: string;

  constructor(private http: HttpClient, private toastCtrl: ToastController, private popoverCtrl: PopoverController) { }

  ngOnInit() { }

  report() {
    this.http.post('http://localhost:3000/reportComment', { commentID: this.commentId }, { responseType: 'text' })
      .subscribe(async () => {
        const toast = await this.toastCtrl.create({ header: 'El comentario fue reportado.', position: 'top', duration: 4000 });
        await toast.present();
        this.popoverCtrl.dismiss();
      });
  }

  hide() {
    const post = (document.querySelector(`#post-${this.commentId}`) as HTMLElement);
    const hidden = (document.querySelector(`#post-${this.commentId} > .hidden`) as HTMLElement);
    const img = (document.querySelector(`#post-${this.commentId} > .image`) as HTMLElement);

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

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-comment-options',
  templateUrl: './comment-options.component.html',
  styleUrls: ['./comment-options.component.scss'],
})
export class CommentOptionsComponent implements OnInit {
  commentId: string;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private storage: Storage) { }

  ngOnInit() { }

  // Report a comment sending the commentId.
  report() {
    this.http.post('http://localhost:3000/reportComment', { commentID: this.commentId }, { responseType: 'text' })
      .subscribe(async () => {
        const toast = await this.toastCtrl.create({ header: 'El comentario fue reportado.', position: 'top', duration: 4000 });
        await toast.present();
      });
    this.popoverCtrl.dismiss();
  }

  // Hide a comment per commentId and save as index in IonStorage,
  async hide(): Promise<any> {
    const comment = (document.querySelector(`#comment_${this.commentId}`) as HTMLElement);
    const commentIcon = (document.querySelector(`#comment_${this.commentId} + ion-avatar`) as HTMLElement);
    comment.style.display = 'flex';
    commentIcon.style.display = 'none';

    // Dismiss options.
    this.popoverCtrl.dismiss();

    // Save the comment.
    const id = await this.storage.get('hiddenCommentId');
    if (id) {
      id.push(this.commentId);
      return this.storage.set('hiddenCommentId', id);
    } else {
      return this.storage.set('hiddenCommentId', [this.commentId]);
    }
  }
}

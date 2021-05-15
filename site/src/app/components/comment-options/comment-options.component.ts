import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { createUrl } from 'src/app/helpers/functions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment-options',
  templateUrl: './comment-options.component.html',
  styleUrls: ['./comment-options.component.scss'],
})
export class CommentOptionsComponent implements OnInit {
  postID: string;
  commentId: string;
  userID: string;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private storage: Storage,
    private authServ: AuthService) { }

  ngOnInit() { }

  // Report a comment sending the commentId.
  report() {
    this.http.post(createUrl('reportComment'), { commentID: this.commentId }, { responseType: 'text' })
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

  async delete() {
    const adminToken = await this.authServ.getToken();
    this.http.post(createUrl('delete-comment'), { postID: this.postID, commentID: this.commentId, token: adminToken }, { responseType: 'text' }).subscribe(async () => {
      const toast = await this.toastCtrl.create({ header: 'El comentario fue borrado.', position: 'top', duration: 4000 });
      await toast.present();
    });
    this.popoverCtrl.dismiss();
  }

  async ban() {
    const adminToken = await this.authServ.getToken();
    this.http.post(createUrl('ban'), { userID: this.userID, token: adminToken }, { responseType: 'text' }).subscribe(async () => {
      const toast = await this.toastCtrl.create({ header: 'El usuario fue baneado.', position: 'top', duration: 4000 });
      await toast.present();
    });
    this.popoverCtrl.dismiss();
  }
}

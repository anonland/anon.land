import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { createUrl } from 'src/app/helpers/functions';

@Component({
  selector: 'app-post-options',
  templateUrl: './post-options.component.html',
  styleUrls: ['./post-options.component.scss'],
})
export class PostOptionsComponent implements OnInit {
  postId: string;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private storage: Storage) { }

  ngOnInit() { }

  // Report a post sending the postId.
  report() {
    this.http.post(createUrl('report'), { postID: this.postId }, { responseType: 'text' })
      .subscribe(async () => {
        const toast = await this.toastCtrl.create({ header: 'El post fue reportado.', position: 'top' });
        await toast.present();
      });
    this.popoverCtrl.dismiss();
  }

  // Hide a post per postId and save as index in IonStorage,
  async hide(): Promise<any> {
    const post = (document.querySelector(`#post_${this.postId}`) as HTMLElement);
    const postContent = (document.querySelector(`#post_${this.postId} ~ .content`) as HTMLElement);
    post.style.display = 'flex';
    postContent.style.display = 'none';

    // Dismiss options.
    this.popoverCtrl.dismiss();

    // Save the post.
    const id = await this.storage.get('hiddenPostId');
    if (id) {
      id.push(this.postId);
      return this.storage.set('hiddenPostId', id);
    } else {
      return this.storage.set('hiddenPostId', [this.postId]);
    }
  }
}

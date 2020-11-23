import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Post } from 'src/app/interfaces/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  public postId: string;
  public post: Post;

  @ViewChild("txtComment") private txtComment: HTMLIonTextareaElement;

  constructor(
    public toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
  }

  async comment() {
    const commentText = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const toast = await this.toastCtrl.create({ message: 'Mensaje publicado correctamente', position: 'top', duration: 3000 });
    await toast.present();
  }

  async goBack() {
    const overlay = await this.modalCtrl.getTop();

    if (overlay != undefined)
      this.modalCtrl.dismiss();
  }
}

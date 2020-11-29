import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  public postId: string;
  public post: Post;
  public comments = new Array<any>();

  @ViewChild("txtComment") private txtComment: HTMLIonTextareaElement;

  constructor(
    public toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private title: Title,
    private http: HttpClient,
    private postServ: PostService) { }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    this.title.setTitle(this.post.title + ' | Anon Land');
    this.getComments();
  }

  async comment() {
    const body = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.http.post('http://localhost:3000/comment', {
      body,
      img: '',
      postId: this.post.id,
      userId: localStorage.getItem("session")
    }).subscribe(async _ => {
      const toast = await this.toastCtrl.create({ message: 'Mensaje publicado correctamente', position: 'top', duration: 3000 });
      await toast.present();
    })

  }

  async goBack() {
    const overlay = await this.modalCtrl.getTop();

    if (overlay != undefined)
      this.modalCtrl.dismiss();
  }

  getComments() {
    this.postServ
      .getComments(this.post.id)
      .then(comments => comments
        .forEach(comment => this.comments.push(comment.data()))
      )
  }
}

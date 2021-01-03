import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, AfterViewInit {
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
    private postServ: PostService,
    private authServ: AuthService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    this.title.setTitle(this.post.title + ' | Anon Land');
    this.getComments();
  }

  ngAfterViewInit() {
    this.randomAnon();
  }

  async comment() {
    const body = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.http.post('http://localhost:3000/comment', {
      body,
      img: '',
      postId: this.post.id,
      userId: localStorage.getItem("session"),
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

  // Random ANON icon.
  randomAnon() {
    const randomAnonNumber = Math.floor((Math.random() * 9) + 1);
    return `../../../assets/anon/anon-${randomAnonNumber}.svg`;
  }

  // Comments options.
  showOptions() {
    alert('Este comentario no tiene opciones.');
  }

  async deletePost() {
    // this.alertCtrl.create({header: 'Borrar post', body: '¿Estas seguro de borrar este post?'})
    this.postServ.deletePost(this.post.id);
    const toast = await this.toastCtrl.create({ header: 'Post borrado correctamente' });
    await toast.present();
    this.modalCtrl.dismiss();
  }

  deleteComment() {

  }

  movePost() {

  }

  async banUser() {
    await this.http.post('http://localhost:3000', { opIP: this.post.opIP }).toPromise();
    const toast = await this.toastCtrl.create({ header: 'Usuario baneado correctamente' });
    await toast.present();
  }

  report() {
    this.http.post('http://localhost:3000/report', { postID: this.post.id }, { responseType: 'text' }).subscribe(async () => {
      const toast = await this.toastCtrl.create({ header: 'Post reportado correctamente', position: 'top' });
      await toast.present();
    });
  }
}

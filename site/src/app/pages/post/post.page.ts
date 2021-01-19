import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, AfterViewInit {
  public postId: string;
  public post: Post = new Post();
  public comments = new Array<any>();
  public commentBtnDisabled = false; // Button is enable.
  public timer: string;

  @ViewChild("txtComment") private txtComment: HTMLIonTextareaElement;

  constructor(
    public toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private http: HttpClient,
    private postServ: PostService,
    private authServ: AuthService,
    private alertCtrl: AlertController,
    private sessionServ: SessionService) { }

  async ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    const postDoc = await this.postServ.getPostById(this.postId).toPromise();
    this.post = postDoc.data() as any;
    this.title.setTitle(this.post.title + ' | Anon Land');
    this.getComments();
  }

  ngAfterViewInit() {
    this.randomAnon();
  }

  commentTimer() {
    this.commentBtnDisabled = true;

    setTimeout(() => {
      this.commentBtnDisabled = false;
    }, 30000); // Time to wait for comment.

    let timeLeft = 30;
    const commentTime = setInterval(() => {
      timeLeft--;
      this.timer = `Esperar ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(commentTime);
        this.timer = ''; // Disappear timer.
      }
    }, 1000); // Refresh each 1s.
  }

  async comment() {
    const body = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    let buttonAlert: string;

    // If comment is void send an alert.
    // Else the timer start.
    switch (body.length) {
      case 0:
        buttonAlert = 'El comentario está vacio.';
        break;
      default:
        buttonAlert = 'Mensaje publicado correctamente.';
        this.commentTimer();
        break;
    }

    this.http.post('http://localhost:3000/comment', {
      body,
      img: '',
      postId: this.post.id,
      userId: this.sessionServ.getSession(),
    }).subscribe(async _ => {
      const toast = await this.toastCtrl.create({
        message: buttonAlert,
        position: 'top',
        duration: 3000
      });
      await toast.present();
    });
  }

  async getComments() {
    const comments = await this.postServ.getComments(this.postId)
    comments.forEach(comment => this.comments.push(comment.data()));
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
    const alert = await this.alertCtrl.create({
      header: 'Borrar post',
      message: '¿Estas seguro de borrar este post?',
      buttons: [{ text: 'Cancelar', role: 'cancel' }, {
        text: 'Aceptar', handler: async () => {
          await this.postServ.deletePost(this.postId);
          const toast = await this.toastCtrl.create({ header: 'Post borrado correctamente' });
          await toast.present();
        }
      }]
    });

    alert.present();
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

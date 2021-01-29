import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { CommentOptionsComponent } from 'src/app/components/comment-options/comment-options.component';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  public postId: string;
  public post: Post = new Post();
  public comments = new Array<any>();
  public commentBtnDisabled = false; // Button is enable.
  public timer: string;
  public imgComment;
  public imgPreview = '../../../assets/anon/anon-1.svg';

  @ViewChild('txtComment') private txtComment: HTMLIonTextareaElement;
  @ViewChild('selMove') private selMove: HTMLIonSelectElement;

  constructor(
    public toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private http: HttpClient,
    private postServ: PostService,
    private authServ: AuthService,
    private alertCtrl: AlertController,
    private sessionServ: SessionService,
    private popoverCtrl: PopoverController,
    private storage: Storage) { }

  async ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    const postDoc = await this.postServ.getPostById(this.postId).toPromise();
    this.post = postDoc.data() as any;
    this.title.setTitle(this.post.title + ' | Anon Land');
    this.getComments();
  }

  commentTimer() {
    this.commentBtnDisabled = true;

    setTimeout(() => {
      this.commentBtnDisabled = false;
    }, 5000); // Time to wait for comment.

    let timeLeft = 5;
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
    // Replace escaped characters.
    let body = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log(body);

    // Make green text.
    const greenText = '<div style="color: #2dd36f; font-weight: bold;">$1</div>';
    body = body.replace(/((^|\s|\t)[>].*<br>)/g, greenText);

    // Alert message.
    let buttonAlert: string;

    // Manage comment status.
    switch (body.length) {
      case 0:
        buttonAlert = 'El comentario está vacio.';
        break;
      default:
        buttonAlert = 'Mensaje publicado correctamente.';
        this.commentTimer();
        break;
    }

    const formData = new FormData();
    formData.append('body', body);
    formData.append('post-img-upload', this.imgComment);
    formData.append('postId', this.postId);
    formData.append('userId', this.sessionServ.getSession());

    this.http.post('http://localhost:3000/comment', formData).subscribe(async _ => {
      const toast = await this.toastCtrl.create({
        message: buttonAlert,
        position: 'top',
        duration: 3000
      });
      await toast.present();
    });
  }

  async getComments() {
    const comments = await this.postServ.getComments(this.postId);
    this.comments = comments.docs.map(comment => {
      const commentObj: any = comment.data();
      commentObj.id = comment.id;
      // Display placard for each hide comment.
      this.storage.forEach((key, value) => {
        if (value === 'hiddenCommentId') {
          key.forEach((id: string) => this.toggleHide(id));
        }
      });
      return commentObj;
    });
  }

  async showOptions($event: MouseEvent, commentId: string) {
    $event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: CommentOptionsComponent,
      event: $event,
      componentProps: { commentId }
    });
    await popover.present();
  }

  // Disappear placard on the comment and show then.
  showComment(commentId: string) {
    const comment = (document.querySelector(`#comment_${commentId}`) as HTMLElement);
    const commentIcon = (document.querySelector(`#comment_${commentId} + ion-avatar`) as HTMLElement);
    comment.style.display = 'none';
    commentIcon.style.display = 'block';

    // Delete the comment id as value from 'hiddenCommentId'.
    this.storage.get('hiddenCommentId').then((id: string[]) => {
      if (!id || id.length === 0) { return null; } // Do nothing if is null.

      const toKeep: string[] = [];

      for (const i of id) {
        if (i !== commentId) {
          toKeep.push(i);
        }
      }

      // Finally return the new hidden comments list.
      this.storage.set('hiddenCommentId', toKeep);
    });
  }

  // Display placard for show the comment.
  // Function is call in getComments().
  toggleHide(commentId: string) {
    const comment = (document.querySelector(`#comment_${commentId}`) as HTMLElement);
    const commentIcon = (document.querySelector(`#comment_${commentId} + ion-avatar`) as HTMLElement);
    comment.style.display = 'flex';
    commentIcon.style.display = 'none';
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

  async movePost() {
    if (this.selMove.value == null) {
      return;
    }

    await this.postServ.movePost(this.postId, this.selMove.value);
    const toast = await this.toastCtrl.create({ header: 'Post movido correctamente' });
    await toast.present();
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

  onSelectFile(preview: any) {
    if (preview.target.files && preview.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(preview.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imgComment = preview.target.files[0];
        this.imgPreview = event.target.result.toString();
      };
    }
  }
}

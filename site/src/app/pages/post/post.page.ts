import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { CommentOptionsComponent } from 'src/app/components/comment-options/comment-options.component';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';
import { Storage } from '@ionic/storage';
import { CommentService } from 'src/app/services/comment.service';
import { createUrl } from 'src/app/helpers/functions';

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
  public newComments = 0;
  public newCommentsToast: HTMLIonToastElement;

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
    private router: Router,
    private storage: Storage,
    private commentServ: CommentService) { }

  async ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId');
    const postDoc = await this.postServ.getPostById(this.postId).toPromise();

    if (!postDoc || !postDoc.exists) {
      this.router.navigate(['/']);
      return;
    }

    this.post = postDoc.data() as any;
    this.title.setTitle(this.post.title + ' | Anon Land');
    this.getComments();
    this.setSocketsHandler();
  }

  setSocketsHandler() {
    this.commentServ.setSocketsHandler(this.postId, async () => {
      this.newComments++;

      const header = (this.newComments == 1) ? `Hay 1 nuevo comentario` : `Hay ${this.newComments} nuevos comentarios`;

      if (this.newCommentsToast == undefined) {
        const toast = await this.toastCtrl.create({ header, duration: 600000, position: 'top', color: 'success' });
        await toast.present();

        const reloadComments = () => {
          toast.dismiss();
          this.newComments = 0;
          this.newCommentsToast = undefined;
          this.getComments();
        }

        toast.onclick = reloadComments;
        this.newCommentsToast = toast;
      } else {
        this.newCommentsToast.header = header;
      }
    })
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
    if (this.txtComment.value?.length == 0) {
      const toast = await this.toastCtrl.create({ header: 'El comentario está vacio', duration: 3000, position: 'top', color: 'warning' });
      await toast.present();
      return;
    }

    // Replace escaped characters.
    let body = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');

    if ((body.match(/<br>/g) || []).length > 4 || body.length > 250) {
      const toast = await this.toastCtrl.create({ header: 'El comentario es muy largo', duration: 3000, position: 'top', color: 'warning' });
      await toast.present();
      return;
    }

    // Make green text.
    const greenText = '<div style="color: #2dd36f; font-weight: bold;">$1</div>';
    body = body.replace(/((^|\s|\t)[>].*<br>)/g, greenText);

    // Alert message.
    let buttonAlert: string;

    // Manage comment status.
    buttonAlert = 'Mensaje publicado correctamente.';
    this.txtComment.value = "";
    this.commentTimer();

    this.commentServ.removeSocketsHandler(this.postId);

    const formData = new FormData();
    formData.append('body', body);
    formData.append('post-img-upload', this.imgComment);
    formData.append('postId', this.postId);
    formData.append('userId', await this.sessionServ.getSession());

    this.http.post(createUrl('comment'), formData, { responseType: 'text' }).subscribe(async _ => {
      this.getComments();
      this.setSocketsHandler();
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

  async showOptions($event: MouseEvent, commentId: string, userID: string) {
    $event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: CommentOptionsComponent,
      event: $event,
      componentProps: { commentId, userID }
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
    await this.http.post(createUrl('ban'), { opIP: this.post.opIP }).toPromise();
    const toast = await this.toastCtrl.create({ header: 'Usuario baneado correctamente' });
    await toast.present();
  }

  report() {
    this.http.post(createUrl('report'), { postID: this.post.id }, { responseType: 'text' }).subscribe(async () => {
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

  navigateToMain() {
    this.commentServ.removeSocketsHandler(this.postId);
    this.router.navigate['/'];
  }
}

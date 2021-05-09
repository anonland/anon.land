import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, IonContent, ToastController } from '@ionic/angular';
import { NotificationsPreviewComponent } from '../../components/notifications-preview/notifications-preview.component';
import { PostOptionsComponent } from '../../components/post-options/post-options.component';
import { Post } from '../../interfaces/post';
import { NewPostPage } from '../new-post/new-post.page';
import { PostService } from '../../services/post.service';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { DOCUMENT } from '@angular/common';
import { Storage } from '@ionic/storage';
import { createUrl } from 'src/app/helpers/functions';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  @ViewChild(IonContent) content: IonContent;

  public category: string;
  public posts = new Array<Post>();
  public endOfThePage = false;
  public isDown = false;
  public newPosts = 0;
  private newPostsToast: HTMLIonToastElement;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private postServ: PostService,
    private router: Router,
    private http: HttpClient,
    private title: Title,
    private sessionServ: SessionService,
    private storage: Storage
  ) {
    this.activatedRoute.params.subscribe(async _ => {
      this.title.setTitle('Anon Land');
      this.category = this.activatedRoute.snapshot.paramMap.get('category');

      await this.sessionServ.verifySession();
      await this.getPostsFeed();

      this.hideSavedPosts();
      this.setSocketsHandler();
    });
  }

  async getPostsFeed() {
    let posts;
    if (!this.category || this.category === 'off') {
      posts = await this.postServ.getPostList();
    }
    else {
      posts = await this.postServ.getPostListByCategory(this.category);
    }

    this.posts = new Array<Post>();
    posts.forEach(post => {
      const postObj: Post = post.data() as Post;
      postObj.id = post.id;

      this.posts.push(postObj);
    });
  }

  postTime(milliseconds: number) {
    // Post publish date.
    const postTime: any = new Date(milliseconds * 1000);
    // Actual date.
    const localTime: any = new Date();
    // Difference in milliseconds.
    const timeDifference = localTime - postTime;
    let timeElapsed: string;

    // Times.
    const days = Math.round(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(timeDifference / 3600000);
    const minutes = Math.round((timeDifference / 3600000) * 60);
    const seconds = Math.round((timeDifference / 3600000) * 3600);

    if (minutes < 1) {
      timeElapsed = 'Ahora';
    } else if (minutes >= 1 && minutes <= 60) {
      timeElapsed = `Hace ${minutes} min`;
    }else if (minutes >= 60 && hours <= 24) {
      timeElapsed = `Hace ${hours} h`;
    }else if (days >= 1) {
      timeElapsed = `Hace ${days} Días y ${hours - 24} h`;
    }

    return timeElapsed;
  }

  async setSocketsHandler() {
    this.postServ.setSocketsHandler(async () => {
      this.newPosts++;

      const header = (this.newPosts == 1) ? `Hay 1 nuevo post` : `Hay ${this.newPosts} nuevos post`;

      if (this.newPostsToast === undefined) {
        const toast = await this.toastCtrl.create({ header, duration: 600000, position: 'top', color: 'success' });
        await toast.present();

        const reloadPosts = () => {
          toast.dismiss();
          this.newPosts = 0;
          this.newPostsToast = undefined;
          this.getPostsFeed();
        };

        toast.onclick = reloadPosts;
        this.newPostsToast = toast;
      } else {
        this.newPostsToast.header = header;
      }
    });
  }

  async openPost(post: Post) {
    this.newPostsToast?.dismiss();
    this.postServ.removeSocketsHandler();
    this.router.navigate([post.category, post.id]);
  }

  async createPost() {
    const modal = await this.modalCtrl.create({
      component: NewPostPage,
      cssClass: 'create-new-post-modal',
    });
    await modal.present();
    const event = await modal.onDidDismiss();
    if (event.data != null) {
      this.postServ.removeSocketsHandler();

      const formData = new FormData();
      formData.append('post-img-upload', event.data.img);
      formData.append('category', event.data.category);
      formData.append('title', event.data.title);
      formData.append('body', event.data.body);
      formData.append('opid', await this.sessionServ.getSession());

      this.http
        .post(createUrl('create'), formData, { responseType: 'text' })
        .subscribe(async _ => {
          await this.getPostsFeed();
          this.hideSavedPosts();
          this.setSocketsHandler();
        });
    }
  }

  async showOptions($event: MouseEvent, postId: string) {
    console.log($event);
    console.log(postId);
    $event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: PostOptionsComponent,
      event: $event,
      componentProps: { postId }
    });
    await popover.present();
  }

  // Iterate all IDs in hiddenPostId.
  hideSavedPosts() {
    this.storage.forEach((value, key) => {
      if (key === 'hiddenPostId') {
        value.forEach((id: string) => this.toggleHide(id));
      }
    });
  }

  // Display placard for show the post.
  toggleHide(postId: string) {
    const post = (document.querySelector(`#post_${postId}`) as HTMLElement);
    const postImg = (document.querySelector(`#post_${postId} + img`) as HTMLElement);
    post.style.display = 'flex';
    postImg.style.display = 'none';

    // Delete the post id as value from 'hiddenPostId'.
    this.storage.get('hiddenPostId').then((id: string[]) => {
      if (!id || id.length === 0) { return null; } // Do nothing if is null.

      const toKeep: string[] = [];

      for (const i of id) {
        if (i !== postId) {
          toKeep.push(i);
        }
      }

      // Finally return the new hidden comments list.
      this.storage.set('hiddenPostId', toKeep);
    });
  }

  // Show the post and pop its id.
  showPost(postId: string) {
    const post = (document.querySelector(`#post_${postId}`) as HTMLElement);
    const postImg = (document.querySelector(`#post_${postId} + img`) as HTMLElement);
    post.style.display = 'none';
    postImg.style.display = 'block';

  }

  async openNotificationsPreview($event: MouseEvent) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsPreviewComponent,
      event: $event,
    });
    await popover.present();
  }

  onScroll(e: any) {
    if (e.detail.scrollTop > 500) {
      this.isDown = true;
    } else if (e.detail.scrollTop < 500) {
      this.isDown = false;
    }
  }

  goToTop() {
    this.content.scrollToPoint(0, 0, 400);
  }

  loadEndOfThePage() {
    this.endOfThePage = true;
  }

}

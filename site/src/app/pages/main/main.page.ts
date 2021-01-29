import { async } from '@angular/core/testing';
import { AfterViewInit, Component, OnInit, Inject, ViewChild, EventEmitter  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, IonContent } from '@ionic/angular';
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

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent) content: IonContent;

  public category: string;
  public posts = new Array<Post>();
  public endOfThePage = false;
  public isDown = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private postServ: PostService,
    private router: Router,
    private http: HttpClient,
    private title: Title,
    private sessionServ: SessionService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    this.title.setTitle('Anon Land');
    this.category = this.activatedRoute.snapshot.paramMap.get('category');

    await this.sessionServ.verifySession();

    let posts;
    if (!this.category || this.category === 'off') {
      posts = await this.postServ.getPostList();
    }
    else {
      posts = await this.postServ.getPostListByCategory(this.category);
    }

    posts.forEach(post => {
      const postObj: Post = post.data() as Post;
      postObj.id = post.id;

      this.posts.push(postObj);
    });

    // Hide posts.
    this.hideSavedPosts();
  }

  async openPost(post: Post) {
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
      let formData = new FormData();
      formData.append('post-img-upload', event.data.img);
      formData.append('category', event.data.category);
      formData.append('title', event.data.title);
      formData.append('body', event.data.body);
      formData.append('opid', this.sessionServ.getSession());
      this.http
        .post('http://localhost:3000/create', formData)
        .subscribe((data) => console.log(data));
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
      //if (!id || id.length === 0) { return null; } // Do nothing if is null.

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

  ngAfterViewInit() {
  }

}

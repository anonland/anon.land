import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { NotificationsPreviewComponent } from '../../components/notifications-preview/notifications-preview.component';
import { PostOptionsComponent } from '../../components/post-options/post-options.component';
import { Post } from '../../interfaces/post';
import { NewPostPage } from '../new-post/new-post.page';
import { PostService } from '../../services/post.service';
import { PostPage } from '../post/post.page';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public category: string;

  public posts = new Array<Post>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private postServ: PostService,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private title: Title
  ) { }

  ngOnInit() {
    this.category = this.activatedRoute.snapshot.paramMap.get('category');

    // session creation.. DESCOMENTAR PARA PRODUCCION
    if (localStorage.getItem('session') == '')
      this.http.post('http://localhost:3000/session', {}, { headers: { 'x-forwarded-for': '192.168.0.1' } })
        .subscribe(data => localStorage.setItem('session', data.toString()));

    this.postServ.getPostList().then((posts) => {
      posts.forEach(post => {
        const postObj: Post = post.data() as Post;
        postObj.id = post.id;

        this.posts.push(postObj);
      });
    });
  }

  async openPost(post: Post) {
    const modal = await this.modalCtrl.create({
      component: PostPage,
      componentProps: { post: post },
      cssClass: 'div-fullscreen',
    });

    this.changeUrl(`${post.category}/${post.id}`);

    await modal.present();
    await modal.onDidDismiss();

    this.changeUrl(this.category ?? '');
    this.title.setTitle('Anon Land');
  }

  private changeUrl(url: string) {
    // Generate the URL:
    const generatedUrl = this.router.createUrlTree([url]).toString();

    // Change the URL without navigate:
    this.location.go(generatedUrl);
  }

  async createPost() {
    const modal = await this.modalCtrl.create({
      component: NewPostPage,
      cssClass: 'create-new-post-modal',
    });
    await modal.present();
    const event = await modal.onDidDismiss();
    if (event.data != null) {
      this.http
        .post('http://localhost:3000/create', event.data)
        .subscribe((data) => console.log(data));
    }
  }

  async showOptions($event: MouseEvent) {
    $event.stopPropagation();
    const popover = await this.popoverCtrl.create({
      component: PostOptionsComponent,
      event: $event,
    });
    await popover.present();
  }

  async openNotificationsPreview($event: MouseEvent) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsPreviewComponent,
      event: $event,
    });
    await popover.present();
  }
}

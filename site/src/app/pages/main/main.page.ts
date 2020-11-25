import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, PopoverController } from "@ionic/angular";
import { NotificationsPreviewComponent } from "../../components/notifications-preview/notifications-preview.component";
import { PostOptionsComponent } from "../../components/post-options/post-options.component";
import { Post } from "../../interfaces/post";
import { NewPostPage } from "../new-post/new-post.page";
import { PostService } from "../../services/post.service";
import { PostPage } from "../post/post.page";
import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Session } from "protractor";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.category = this.activatedRoute.snapshot.paramMap.get("category");

    // session creation.. DESCOMENTAR PARA PRODUCCION
    /**     let session = this.http
      .post(
        "http://localhost:3000/session",
        {},
        { headers: { "x-forwarded-for": "192.168.0.1" } }
      )
      .subscribe((data) =>
        localStorage.setItem("session", JSON.stringify(data))
      );*/

    this.postServ.getPostList().subscribe((posts) => {
      this.posts = posts.map((post) => {
        const postObj: Post = post.payload.doc.data() as Post;
        postObj.id = post.payload.doc.id;

        return postObj;
      });
    });
  }

  async openPost(post: Post) {
    const modal = await this.modalCtrl.create({
      component: PostPage,
      componentProps: { post: post },
      cssClass: "div-fullscreen",
    });

    this.changeUrl(`${post.category}/${post.id}`);

    await modal.present();
    await modal.onDidDismiss();

    this.changeUrl(this.category ?? "");
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
      cssClass: "div-modal",
    });
    await modal.present();
    const event = await modal.onDidDismiss();
    if (event.data != null) {
      this.http
        .post("http://localhost:3000/create", {
          session: JSON.parse(localStorage.getItem("session")),
          data: event.data,
        })
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

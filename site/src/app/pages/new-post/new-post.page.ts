import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  public newPostForm: FormGroup;

  constructor(private modalCtrl: ModalController) {
    this.newPostForm = new FormGroup({
      category: new FormControl('general', Validators.required),
      image: new FormControl(undefined, Validators.required),
      title: new FormControl(undefined, Validators.required),
      content: new FormControl(undefined),
    });
   }

  ngOnInit() {
  }

  cancel(){
    this.modalCtrl.dismiss();
  }

  create(){
    const {category, image, title, content } = this.newPostForm.value;

    this.modalCtrl.dismiss({ category, image, title, content});
  }
}

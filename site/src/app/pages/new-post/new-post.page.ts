import { HttpClient } from '@angular/common/http';
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

  constructor(private modalCtrl: ModalController, private http: HttpClient) {
    this.newPostForm = new FormGroup({
      category: new FormControl('general', Validators.required),
      img: new FormControl(''),
      title: new FormControl(undefined, Validators.required),
      body: new FormControl(undefined),
    });
  }

  // Image preview container.
  img: any = '';

  // Text on Img upload input.
  showUploadImgText = true;

  ngOnInit() { }

  cancelCreate() {
    this.modalCtrl.dismiss();
  }

  createNewPost() {
    const { category, img, title, body } = this.newPostForm.value;

    this.modalCtrl.dismiss({ category, img, title, body });
  }

  onSelectFile(preview: any) {
    if (preview.target.files && preview.target.files[0]) {
      const reader = new FileReader();

      this.showUploadImgText = false;

      reader.readAsDataURL(preview.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.img = event.target.result;
      };
    }
  }
}

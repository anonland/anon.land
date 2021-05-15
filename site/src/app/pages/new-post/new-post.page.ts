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
  private showUploadImgText = true;

  constructor(private modalCtrl: ModalController, private http: HttpClient) {
    this.newPostForm = new FormGroup({
      category: new FormControl('off', Validators.required),
      img: new FormControl(''),
      imgPreview: new FormControl(''),
      title: new FormControl(undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      body: new FormControl(undefined, Validators.maxLength(1500))
    });
  }

  ngOnInit() { }

  cancelCreate() {
    this.modalCtrl.dismiss();
  }

  createNewPost() {
    this.modalCtrl.dismiss(this.newPostForm.value);
  }

  onSelectFile(preview: any) {
    if (preview.target.files && preview.target.files[0]) {
      const reader = new FileReader();

      this.showUploadImgText = false;

      reader.readAsDataURL(preview.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.newPostForm.patchValue({ img: preview.target.files[0] });
        this.newPostForm.patchValue({ imgPreview: event.target.result });
      };
    }
  }
}

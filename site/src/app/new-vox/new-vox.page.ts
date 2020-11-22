import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-vox',
  templateUrl: './new-vox.page.html',
  styleUrls: ['./new-vox.page.scss'],
})
export class NewVoxPage implements OnInit {
  public newVoxForm: FormGroup;

  constructor(private modalCtrl: ModalController) {
    this.newVoxForm = new FormGroup({
      category: new FormControl('general', Validators.required),
      image: new FormControl(undefined, Validators.required),
      content: new FormControl(undefined, Validators.required),
    });
   }

  ngOnInit() {
  }

  cancel(){
    this.modalCtrl.dismiss();
  }

  create(){
    const {category, image, content } = this.newVoxForm.value;

    this.modalCtrl.dismiss({ category, image, content});
  }
}

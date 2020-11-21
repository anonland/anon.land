import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vox',
  templateUrl: './vox.page.html',
  styleUrls: ['./vox.page.scss'],
})
export class VoxPage implements OnInit {
  titulo = "alto vox xd"
  comments = [{
    text: "comentario"
  }, {
    text: "comentario"
  }, {
    text: "comentario"
  }, {
    text: "comentario"
  }, {
    text: "comentario"
  }, {
    text: "comentario"
  },
  ]

  @ViewChild("txtComment") private txtComment: HTMLIonTextareaElement;

  constructor(public toastCtrl: ToastController) { }

  ngOnInit() {
  }

  async comment() {
    const commentText = this.txtComment.value.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const toast = await this.toastCtrl.create({ message: 'Mensaje publicado correctamente', position: 'top', duration: 3000 });
    await toast.present();
  }

}

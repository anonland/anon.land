import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { NotificationsPreviewComponent } from '../components/notifications-preview/notifications-preview.component';
import { VoxOptionsComponent } from '../components/vox-options/vox-options.component';
import { NewVoxPage } from '../new-vox/new-vox.page';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public category: string;
  public posts = [{
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  }, {
    title: 'Codubi cerro voxed jijode'
  },
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.category = this.activatedRoute.snapshot.paramMap.get('id');
  }

  async startNewVox() {
    const modal = await this.modalCtrl.create({ component: NewVoxPage });
    modal.present();

    const event = await modal.onDidDismiss();

    if (event.data != null) {
      //TODO: Guardar en BD
    }
  }

  async showOptions($event: MouseEvent) {
    $event.stopPropagation();
    const popover = await this.popoverCtrl.create({
       component: VoxOptionsComponent,
       event: $event
      });
    await popover.present();
  }

  async openNotificationsPreview($event: MouseEvent) {
    const popover = await this.popoverCtrl.create({
       component: NotificationsPreviewComponent,
       event: $event
      });
    await popover.present();
  }
}

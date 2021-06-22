import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications-preview',
  templateUrl: './notifications-preview.component.html',
  styleUrls: ['./notifications-preview.component.scss'],
})
export class NotificationsPreviewComponent implements OnInit {
  public notifications: Array<any>;
  constructor(
    private notificationsServ: NotificationsService,
    private popoverCtrl: PopoverController,
    private router: Router
    ) { }

  async ngOnInit() {
    this.notifications = new Array<any>();
    (await this.notificationsServ.getNotifications()).docs.forEach(notification => {
      const notificationObj: any = notification.data();
      notificationObj.id = notification.id;
      this.notifications.push(notificationObj);
    });
  }

  async goToPost(postUrl) {
    await this.popoverCtrl.dismiss();
    await this.router.navigate([postUrl]);
  }
}

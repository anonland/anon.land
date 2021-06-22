import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private sessionServ: SessionService, private afs: AngularFirestore) { }

  async getNotifications() {
    const userId = await this.sessionServ.getSession();
    return this.afs.collection('notifications', ref => ref.where('userId', '==', userId).orderBy('createdAt').limit(5)).get().toPromise();
  }
}

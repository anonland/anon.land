import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private auth: AuthService, private afs: AngularFirestore) { }

  getNotifications() {
    return this.afs.collection('notifications', ref => ref.where('userID', '==', this.auth.user.uid).orderBy('createdAt').limit(5)).get().toPromise();
  }
}

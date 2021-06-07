import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private afs: AngularFirestore) { }

  getPostsReports() {
    return this.afs.collection('posts', ref => ref.where('reports', '>', 0).orderBy('reports', 'desc').limit(3)).get().toPromise();
  }

  getCommentsReports() {
    return this.afs.collection('comments', ref => ref.where('reports', '>', 0).orderBy('reports', 'desc').limit(3)).get().toPromise();
  }
}

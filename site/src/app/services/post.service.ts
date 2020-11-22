import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore) { }

  getPostList(){
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore) { }

  getPostList() {
    return this.db.collection('posts').ref.orderBy('createdAt', 'desc').get();
  }

  getPostListByCategory(category: string){
    return this.db.collection('posts').ref.where('category', '==', category).orderBy('createdAt', 'desc').get();
  }

  getComments(postId: string) {
    return this.db.collection('comments').ref.where('postId', '==', postId).orderBy('createdAt', 'desc').get();
  }

  getCommentsWebSocket(postId: string) {
    return new WebSocket('http://localhost:3000/' + postId).onmessage = () => {
      this.getComments(postId);
    }
  }

  async deletePost(postId: string) {
    return this.db.collection('posts').doc(postId).delete();
  }

  async changePostCategory(postId: string, category: string) {
    return this.db.collection('posts').doc(postId).set({ category: category }, { merge: true })
  }
}

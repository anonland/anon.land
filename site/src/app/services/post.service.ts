import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore, private http: HttpClient, private auth: AuthService) { }

  getPostById(postId: string) {
    return this.db.collection('posts').doc(postId).get();
  }

  getPostList() {
    return this.db.collection('posts').ref.orderBy('createdAt', 'desc').get();
  }

  getPostListByCategory(category: string) {
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

  async deletePost(postID: string) {
    const token = await this.auth.getToken();
    this.http.post('http://localhost:3000/delete', { postID, token }).subscribe((data) => console.log(data));
  }

  async movePost(postID: string, category: string) {
    const token = await this.auth.getToken();
    this.http.post('http://localhost:3000/move', { postID, token, category }).subscribe((data) => console.log(data));
  }

  async changePostCategory(postId: string, category: string) {
    return this.db.collection('posts').doc(postId).set({ category: category }, { merge: true })
  }
}

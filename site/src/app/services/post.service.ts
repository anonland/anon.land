import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { createUrl } from '../helpers/functions';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore, private http: HttpClient, private auth: AuthService, private socket: SocketService) { }

  setSocketsHandler(handler) {
    this.socket.io.on('newPostCreated', handler);
  }

  removeSocketsHandler() {
    this.socket.io.off('newPostCreated');
  }

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

  async deletePost(postID: string) {
    const token = await this.auth.getToken();
    this.http.post(createUrl('delete'), { postID, token }).subscribe((data) => console.log(data));
  }

  async movePost(postID: string, category: string) {
    const token = await this.auth.getToken();
    this.http.post(createUrl('move'), { postID, token, category }).subscribe((data) => console.log(data));
  }

  async changePostCategory(postId: string, category: string) {
    return this.db.collection('posts').doc(postId).set({ category: category }, { merge: true })
  }
}

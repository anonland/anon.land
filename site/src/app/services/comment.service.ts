import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private socket: SocketService) { }

  setNewCommentSocket(postId: string, handler) {
    this.socket.io.on(`${postId}/newComment`, handler);
  }

  removeNewCommentSocket(postId: string) {
    this.socket.io.off(`${postId}/newComment`);
  }

  setDeletedCommentSocket(postId: string, handler) {
    this.socket.io.on(`${postId}/deletedComment`, handler);
  }

  removeDeletedCommentSocket(postId: string) {
    this.socket.io.off(`${postId}/deletedComment`);
  }
}

import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private socket: SocketService) { }

  setSocketsHandler(postId: string, handler) {
    this.socket.io.on(`${postId}/newComment`, handler);
  }

  removeSocketsHandler(postId: string) {
    this.socket.io.off(`${postId}/newComment`);
  }
}

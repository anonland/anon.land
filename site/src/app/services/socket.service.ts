import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public io = io(location.hostname == 'localhost' ? 'http://localhost:5000' : 'https://anon.land:5000');

  constructor() { }
}

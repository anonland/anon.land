import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  getSession(): string {
    return localStorage.getItem('session');
  }

  setSession(session: string) {
    localStorage.setItem('session', session)
  }

  async verifySession() {
    if (!this.isSessionSetted) {
      const session = await this.http.post('http://localhost:3000/session', {}).toPromise();
      this.setSession(session.toString());
    }
  }

  isSessionSetted = () => this.getSession() != '';
}

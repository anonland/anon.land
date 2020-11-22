import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user;

  constructor(/*public afAuth: AngularFireAuth*/) {
    // this.afAuth.authState
    //   .subscribe(user => this.user = user);
  }

// Sign in with Google
GoogleAuth(): any {
  // firebase.auth().signin
  // return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
}

  public loginWithCredentials(email: string, password: string) {
    // return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}

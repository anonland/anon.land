import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
    this.afAuth.onAuthStateChanged(user => this.user = user);
  }

  // Sign in with Google
  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    this.user = await this.getModProfile(credential.user.email);
  }

  private async getModProfile(email: string) {
    const data = await this.afs.collection('mods', ref => ref.where('email', '==', email)).get().toPromise();
    if (!data || data.empty) {
      this.user = undefined;
      throw new Error('Usuario no registrado como mod');
    }

    return data.docs[0].data();
  }

  async getToken() {
    return (await this.afAuth.currentUser).getIdToken(true)
  }

  async signOut() {
    await this.afAuth.signOut();
    this.user = undefined;
    this.router.navigate(['/']);
  }
}

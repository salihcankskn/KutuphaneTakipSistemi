// src/app/services/auth.service.ts -- NİHAİ SÜRÜM

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null | undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Bu, hem Auth hem de Firestore'dan veri okuyan doğru ve tam user$ tanımıdır.
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async register({ email, password }: any) {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (!credential || !credential.user) {
        throw new Error('Kullanıcı oluşturulamadı.');
      }
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(
        `users/${credential.user.uid}`
      );
      const userData: User = {
        uid: credential.user.uid,
        email: credential.user.email!,
        role: 'user',
      };
      await userRef.set(userData, { merge: true });
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Kayıt Hatası:', error);
      alert(`Bir hata oluştu: ${error}`);
    }
  }

  async login({ email, password }: any) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Giriş Hatası:', error);
      alert('E-posta veya şifre hatalı!');
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}

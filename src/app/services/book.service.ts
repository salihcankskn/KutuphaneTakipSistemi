import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';


export interface Book {
  id?: string;
  title: string;
  author: string;
  status: 'available' | 'borrowed';
  borrowedBy?: string | null;
  dueDate?: firebase.firestore.Timestamp | null;
  borrowerEmail?: string | null;
  summary?: string | null;
  imageUrl?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksCollection: AngularFirestoreCollection<Book>;

  constructor(private afs: AngularFirestore) {
    this.booksCollection = afs.collection<Book>('books');
  }

  getBooks(): Observable<Book[]> {
    return this.booksCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Book;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  addBook(book: Omit<Book, 'id'>): Promise<any> {
    return this.booksCollection.add(book);
  }

  deleteBook(id: string): Promise<void> {
    return this.booksCollection.doc(id).delete();
  }

  //Kitap bilgilerini güncelleme fonksiyonu
  updateBook(id: string, data: Partial<Book>): Promise<void> {
    return this.booksCollection.doc(id).update(data);
  }

  borrowBook(
    bookId: string,
    user: { uid: string; email: string }
  ): Promise<void> {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    return this.booksCollection.doc(bookId).update({
      status: 'borrowed',
      borrowedBy: user.uid,
      borrowerEmail: user.email,
      dueDate: dueDate,
    } as any);
  }

  returnBook(bookId: string): Promise<void> {
    return this.booksCollection.doc(bookId).update({
      status: 'available',
      borrowedBy: null,
      borrowerEmail: null,
      dueDate: null,
    });
  }
}

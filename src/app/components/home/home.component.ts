import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Book, BookService } from 'src/app/services/book.service';
import { Modal, Collapse } from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('detailModalEl') detailModalElement!: ElementRef;

  public filteredBooks$!: Observable<Book[]>;
  private allBooks$!: Observable<Book[]>;
  private searchSubject = new BehaviorSubject<string>('');

  private detailModal: Modal | undefined;
  private collapseInstances = new Map<string, Collapse>();

  public newBook: Omit<Book, 'id'> & { summary: string; imageUrl: string } = {
    title: '',
    author: '',
    status: 'available',
    summary: '',
    imageUrl: '',
  };

  public selectedBook: Book | null = null;
  public editingBook: Book | null = null;

  constructor(
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.allBooks$ = this.bookService.getBooks();

    this.filteredBooks$ = combineLatest([
      this.allBooks$,
      this.searchSubject.asObservable(),
    ]).pipe(
      map(([books, searchTerm]) => {
        if (!searchTerm) {
          return books;
        }
        return books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.detailModalElement) {
      this.detailModal = new Modal(this.detailModalElement.nativeElement);
    }
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  toggleBorrowerDetails(bookId: string): void {
    const element = document.getElementById('details-' + bookId);
    if (!element) {
      return;
    }

    let instance = this.collapseInstances.get(bookId);

    if (!instance) {
      instance = new Collapse(element, { toggle: false });
      this.collapseInstances.set(bookId, instance);
    }

    instance.toggle();
  }

  openBookDetailsModal(book: Book): void {
    this.selectedBook = book;
    setTimeout(() => {
      this.detailModal?.show();
    }, 0);
  }

  openEditModal(book: Book): void {
    this.editingBook = { ...book };
  }

  async addBook() {
    if (this.newBook.title && this.newBook.author) {
      try {
        const bookToAdd = {
          title: this.newBook.title,
          author: this.newBook.author,
          status: this.newBook.status,
          summary: this.newBook.summary || null,
          imageUrl: this.newBook.imageUrl || null,
        };
        await this.bookService.addBook(bookToAdd);
        alert('Kitap başarıyla eklendi!');
        this.newBook = {
          title: '',
          author: '',
          status: 'available',
          summary: '',
          imageUrl: '',
        };
      } catch (error) {
        console.error('Kitap eklenirken bir hata oluştu:', error);
        alert('Kitap eklenirken bir hata oluştu.');
      }
    }
  }

  async updateBook(): Promise<void> {
    if (!this.editingBook || !this.editingBook.id) {
      console.error('Düzenlenecek kitap bulunamadı!');
      return;
    }
    try {
      const { id, ...bookData } = this.editingBook;
      await this.bookService.updateBook(id, bookData);
      alert('Kitap başarıyla güncellendi!');
    } catch (error) {
      console.error('Kitap güncellenirken bir hata oluştu:', error);
      alert('Kitap güncellenirken bir hata oluştu.');
    } finally {
      this.editingBook = null;
    }
  }

  async deleteBook(bookId: string | undefined) {
    if (!bookId) {
      console.error('Kitap ID bulunamadı!');
      return;
    }
    const confirmation = confirm(
      'Bu kitabı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
    );
    if (confirmation) {
      try {
        await this.bookService.deleteBook(bookId);
        alert('Kitap başarıyla silindi.');
      } catch (error) {
        console.error('Kitap silinirken bir hata oluştu:', error);
        alert('Kitap silinirken bir hata oluştu.');
      }
    }
  }

  borrowBook(bookId: string | undefined) {
    if (!bookId) return;
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user && user.email) {
        this.bookService
          .borrowBook(bookId, { uid: user.uid, email: user.email })
          .then(() => console.log('Kitap ödünç alındı.'))
          .catch((err) => console.error(err));
      }
    });
  }

  returnBook(bookId: string | undefined) {
    if (!bookId) return;
    this.bookService
      .returnBook(bookId)
      .then(() => console.log('Kitap iade edildi.'))
      .catch((err) => console.error(err));
  }
}


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book, BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  newBook: Omit<Book, 'id'> = {
    title: '',
    author: '',
    status: 'available', // Yeni eklenen her kitap başlangıçta "müsait" olacak
  };

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {}

  async addBook() {
    if (this.newBook.title && this.newBook.author) {
      await this.bookService.addBook(this.newBook);
      alert('Kitap başarıyla eklendi!');
      this.router.navigate(['/home']); // Eklendikten sonra anasayfaya dön
    }
  }
}

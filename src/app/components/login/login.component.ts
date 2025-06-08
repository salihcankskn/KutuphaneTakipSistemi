import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // HTML'deki form input'larına bağlanacak olan nesne
  credentials = {
    email: '',
    password: '',
  };

  // AuthService'i bu component'te kullanmak için constructor'da enjekte ediyoruz.
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  // HTML'deki form submit edildiğinde bu fonksiyon çalışacak.
  login() {
    // AuthService'teki login fonksiyonunu çağırıyoruz ve formdaki bilgileri gönderiyoruz.
    this.authService.login(this.credentials);
  }
}

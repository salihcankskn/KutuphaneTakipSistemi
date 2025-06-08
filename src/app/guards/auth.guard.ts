import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map((user) => !!user), // user nesnesi varsa true, yoksa false döndür.
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log(
            'AuthGuard: Access denied. User not logged in. Redirecting to /login'
          );
          this.router.navigate(['/login']);
        }
      })
    );
  }
}

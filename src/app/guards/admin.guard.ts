// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      // This line is corrected to always return a boolean
      map((user) => !!(user && user.role === 'admin')),
      tap((isAdmin) => {
        if (!isAdmin) {
          console.error('Access Denied - Admins only');
          this.router.navigate(['/home']);
        }
      })
    );
  }
}

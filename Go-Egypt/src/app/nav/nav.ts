import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-nav',
  imports: [CommonModule,RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
 authService = inject(Auth);
  
  private router = inject(Router);

  isMenuOpen = signal(false);

  constructor() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
    this.isMenuOpen.set(false);
  }

  toggleMenu() {
    this.isMenuOpen.update(prev => !prev);
  }
}
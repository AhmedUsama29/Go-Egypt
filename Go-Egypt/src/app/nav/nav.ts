import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  authService = inject(Auth);
  private router = inject(Router);

  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);

  constructor() {
    // ⛔ قفل الدروب داون لما تضغط براها
    window.addEventListener('click', () => {
      this.isDropdownOpen.set(false);
    });
  }

  toggleMenu(event?: Event) {
    event?.stopPropagation();
    this.isMenuOpen.update(prev => !prev);
    this.isDropdownOpen.set(false);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // أهم سطر يمنع الفتح لوحده
    this.isDropdownOpen.update(prev => !prev);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isMenuOpen.set(false);
    this.isDropdownOpen.set(false);
  }
}

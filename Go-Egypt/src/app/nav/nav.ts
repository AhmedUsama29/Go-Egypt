import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { ProfileService } from '../services/profile';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  authService = inject(Auth);
  // public عشان نقدر نوصلها من الـ HTML
  public profileService = inject(ProfileService); 
  private router = inject(Router);

  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  
  constructor() {
    // قفل الدروب داون لما تضغط في أي حتة بره
    window.addEventListener('click', () => {
      this.isDropdownOpen.set(false);
    });

    // Effect لمراقبة حالة الدخول
    effect(() => {
      if (this.authService.isLoggedInSignal()) {
        // بننادي الدالة عشان تجيب الداتا وتحطها في الـ Signal جوه السيرفيس
        this.profileService.getProfilePicture().subscribe();
      } else {
        this.profileService.clearUserData();
      }
    });
  }

  toggleMenu(event?: Event) {
    event?.stopPropagation();
    this.isMenuOpen.update(prev => !prev);
    this.isDropdownOpen.set(false);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update(prev => !prev);
  }

  logout() {
    this.authService.logout();
    this.profileService.clearUserData(); // تصفير الصورة
    this.router.navigate(['/']);
    this.isMenuOpen.set(false);
    this.isDropdownOpen.set(false);
  }
}
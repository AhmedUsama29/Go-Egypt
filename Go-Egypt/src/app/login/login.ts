import { Component, signal, inject } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  private authService = inject(Auth);
  private router = inject(Router);

  constructor() {}


  handleSubmit(event: Event) {
    event.preventDefault();
    
    this.loading.set(true);
    this.error.set(null);

    const credentials = {
      email: this.email(),
      password: this.password()
    };

    this.authService.login(credentials).subscribe({
      
      next: (response) => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },

      error: (err) => {
        this.loading.set(false);
        console.error('Login failed', err);
        
        if (err.status === 404 || err.status === 401) {
          this.error.set('Those details don\'t seem to match our records. Please check and try again.');
        } else {
          this.error.set('An error occurred. Please try again.');
        }
      }
    });
  }
}
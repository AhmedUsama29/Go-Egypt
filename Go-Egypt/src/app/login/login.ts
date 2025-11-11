import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {}

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Login submitted');
  }
}

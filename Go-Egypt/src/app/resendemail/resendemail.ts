import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { PasswordOperations } from '../services/password-operations';

@Component({
  selector: 'app-resendemail',
  imports: [RouterLink, CommonModule],
  templateUrl: './resendemail.html',
  styleUrl: './resendemail.css'
})
export class Resendemail implements OnInit {

  email: string | null = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordOperations
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  resendLink(): void {
    if (!this.email) return;

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.passwordService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'A new link has been sent!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error(err);
      }
    });
  }
}
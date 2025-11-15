import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common'; // 💡 1. إضافة CommonModule
import { PasswordOperations } from '../services/password-operations';

@Component({
  selector: 'app-resendemail',
  imports: [RouterLink, CommonModule], // 💡 3. إضافة CommonModule
  templateUrl: './resendemail.html',
  styleUrl: './resendemail.css'
})
export class Resendemail implements OnInit {

  email: string | null = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // 💡 4. عمل Inject للـ ActivatedRoute والـ Service
  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordOperations
  ) { }

  // 💡 5. أول ما الكومبوننت يفتح، اقرأ الإيميل من الـ URL
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  // 💡 6. اللوجيك بتاع إعادة الإرسال
  resendLink(): void {
    if (!this.email) return; // لو مفيش إيميل، اخرج

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
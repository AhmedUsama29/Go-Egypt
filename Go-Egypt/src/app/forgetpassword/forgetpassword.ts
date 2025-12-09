import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordOperations } from '../services/password-operations';

@Component({
  selector: 'app-forgetpassword',
  imports: [RouterLink, ReactiveFormsModule, CommonModule], 
  templateUrl: './forgetpassword.html',
  styleUrl: './forgetpassword.css'
})
export class Forgetpassword {

  forgotForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordOperations,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  sendResetLink(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const emailValue = this.email!.value;

    this.passwordService.forgotPassword(emailValue).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/resendemail'], { queryParams: { email: emailValue } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error(err);
      }
    });
  }
}
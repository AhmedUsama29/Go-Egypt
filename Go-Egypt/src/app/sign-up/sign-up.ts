import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Auth } from '../services/auth'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  registerForm: FormGroup;
  isSubmitted = false;
  formErrors: any = {};

  loading = signal(false);
  formError = signal<string | null>(null);
  
  emailLoading = signal(false);
  emailError = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationality: ['', Validators.required],
      gender: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }


  checkEmail() {
    const emailControl = this.registerForm.get('email');
    this.emailError.set(null);

    if (emailControl?.invalid) {
      return; 
    }

    this.emailLoading.set(true);
    this.authService.checkEmailExists(emailControl?.value).pipe(
      finalize(() => this.emailLoading.set(false))
    ).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailError.set('This email is already taken.');
          emailControl?.setErrors({ emailTaken: true });
        }
      },
      error: (err) => {
        this.emailError.set('Could not verify email. Please try again.');
      }
    });
  }


  handleSubmit() {
    this.isSubmitted = true;
    this.formError.set(null);
    this.formErrors = {};

    if (this.registerForm.invalid || this.emailLoading() || this.emailError()) {
      this.collectFormErrors();
      return;
    }

    this.loading.set(true);
    
    const { confirmPassword, ...registerRequest } = this.registerForm.value;

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.loading.set(false);
        this.formError.set(err.error?.errorMessage || 'An unknown error occurred.');
      }
    });
  }

  private collectFormErrors() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if (controlErrors) {
        if (controlErrors['required']) this.formErrors[key] = 'This field is required.';
        if (controlErrors['email']) this.formErrors[key] = 'Please enter a valid email.';
        if (controlErrors['minlength']) this.formErrors[key] = 'Password must be at least 6 characters.';
        if (controlErrors['mismatch']) this.formErrors[key] = 'Passwords do not match.';
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 💡 لازم دي عشان @if
import { PasswordOperations, ResetPasswordRequest } from '../services/password-operations';

@Component({
  selector: 'app-reset-password',
  
  standalone: true, 
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink 
  ],
  
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword implements OnInit {
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  resetForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private email: string | null = null;
  private token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordOperations,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];

      if (!this.email || !this.token) {
        this.errorMessage = "Invalid or expired password reset link.";
        this.resetForm.disable();
      }
    });
  }

  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  submitReset(): void {
    if (this.resetForm.invalid || !this.email || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const request: ResetPasswordRequest = {
      email: this.email!,
      token: this.token!,
      newPassword: this.newPassword!.value
    };

    this.passwordService.resetPassword(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/reset-success']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Failed to reset password. The link may be expired or invalid.";
        console.error(err);
      }
    });
  }
}
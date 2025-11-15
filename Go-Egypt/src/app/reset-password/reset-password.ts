import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordOperations, ResetPasswordRequest } from '../services/password-operations';

@Component({
  selector: 'app-reset-password',
  // 💡 2. إضافة Imports
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
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

  // 💡 3. عمل Inject لكل اللي محتاجينه
  constructor(
    private fb: FormBuilder,
    private passwordService:PasswordOperations,
    private router: Router,
    private route: ActivatedRoute // 💡 4. عشان نقرأ اللينك
  ) {
    this.resetForm = this.fb.group({
      // 💡 5. بناء الفورم
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      // 💡 6. إضافة Validator عشان نتأكد إن الباسوردين زي بعض
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  // 💡 7. دالة الـ Validation
  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
        return null; // فيه خطأ تاني، سيبه
      }

      // لو مش زي بعض، حط إيرور
      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  // 💡 8. أول ما الصفحة تفتح، اقرأ الإيميل والتوكن
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];

      if (!this.email || !this.token) {
        this.errorMessage = "Invalid or expired password reset link.";
        this.resetForm.disable(); // قفل الفورم لو اللينك بايظ
      }
    });
  }

  // 💡 9. Getters لسهولة الوصول في الـ HTML
  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  // 💡 10. الدوال بتاعتك (مظبوطة)
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  // 💡 11. اللوجيك بتاع إرسال الباسورد الجديد
  submitReset(): void {
    if (this.resetForm.invalid || !this.email || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const request: ResetPasswordRequest = {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword!.value
    };

    this.passwordService.resetPassword(request).subscribe({
      next: () => {
        this.isLoading = false;
        // 💡 12. نجح! حوله لصفحة النجاح
        this.router.navigate(['/reset-success']);
      },
      error: (err) => {
        this.isLoading = false;
        // 💡 13. فشل (اللينك غلط، الباسورد ضعيف، ...الخ)
        this.errorMessage = "Failed to reset password. The link may be expired or invalid.";
        console.error(err);
      }
    });
  }
}
import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordOperations } from '../services/password-operations';

@Component({
  selector: 'app-forgetpassword',
  // 💡 2. إضافة ReactiveFormsModule و CommonModule
  imports: [RouterLink, ReactiveFormsModule, CommonModule], 
  templateUrl: './forgetpassword.html',
  styleUrl: './forgetpassword.css'
})
export class Forgetpassword {

  forgotForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  // 💡 3. عمل Inject للـ FormBuilder والـ Service والـ Router
  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordOperations,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      // 💡 4. بناء الفورم
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // 💡 5. دالة بتسهل الوصول للفورم في الـ HTML
  get email() {
    return this.forgotForm.get('email');
  }

  // 💡 6. اللوجيك بتاع إرسال الطلب
  sendResetLink(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched(); // لو الفورم مش سليم، أظهر الأخطاء
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const emailValue = this.email!.value;

    this.passwordService.forgotPassword(emailValue).subscribe({
      next: () => {
        this.isLoading = false;
        // 7. 💡 نجح! حوله للصفحة التانية وابعت الإيميل معاك
        this.router.navigate(['/resendemail'], { queryParams: { email: emailValue } });
      },
      error: (err) => {
        this.isLoading = false;
        // 8. 💡 فشل، أظهر رسالة خطأ
        this.errorMessage = 'An error occurred. Please try again.';
        console.error(err);
      }
    });
  }
}
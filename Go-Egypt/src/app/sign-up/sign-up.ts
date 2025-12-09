import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Auth } from '../services/auth';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

function maxDateValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    const dateOfBirth = new Date(control.value);

    if (dateOfBirth > maxDate) {
      return { minAge: { requiredAge: minAge, actualDate: dateOfBirth } };
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp implements OnInit {

  registerForm: FormGroup;
  isSubmitted = false;
  formErrors: any = {};

  loading = signal(false);
  formError = signal<string | null>(null);

  emailLoading = signal(false);
  emailError = signal<string | null>(null);
  emailSuccess = signal<boolean>(false);
  showToast = signal(false);

  nationalitiesSignal = signal<any[]>([]);

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


constructor() {
  this.registerForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    
    password: ['', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    ]],

    confirmPassword: ['', Validators.required],
    dateOfBirth: ['', [Validators.required, maxDateValidator(18)]],
    nationalityId: ['', [Validators.required, Validators.min(1)]], 
    gender: ['', Validators.required]
  }, {
    validator: this.passwordMatchValidator
  });
}

  ngOnInit() {
    this.authService.getNationalities().subscribe({
      next: (data) => {
        this.nationalitiesSignal.set(data);
      },
      error: (err) => {
        console.error('Failed to load nationalities', err);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      const errors = form.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          form.get('confirmPassword')?.setErrors(null);
        } else {
          form.get('confirmPassword')?.setErrors(errors);
        }
      }
    }
    return null;
  }

  checkEmail() {
    const emailControl = this.registerForm.get('email');

    this.emailError.set(null);
    this.emailSuccess.set(false);

    if (emailControl?.hasError('emailTaken')) {
      if (emailControl.errors) {
        delete emailControl.errors['emailTaken'];
      }
      emailControl.updateValueAndValidity();
    }

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
          emailControl?.setErrors({ ...emailControl.errors, emailTaken: true });
          this.emailSuccess.set(false);
        } else {
          this.emailSuccess.set(true);
          this.emailError.set(null);
        }
      },
      error: (err) => {
        this.emailError.set('Could not verify email. Please try again.');
        this.emailSuccess.set(false);
      }
    });
  }

  handleSubmit() {
    this.isSubmitted = true;
    this.formError.set(null);
    this.formErrors = {};

    if (this.registerForm.invalid || this.emailLoading() || this.emailError() || !this.emailSuccess()) {
      this.collectFormErrors();
      
      if (this.registerForm.get('email')?.valid && !this.emailSuccess() && !this.emailError()) {
         this.emailError.set('Please verify your email.');
      }
      return;
    }

    this.loading.set(true);
    this.showToast.set(true);
    this.cdr.detectChanges(); 

    setTimeout(() => {
      this.showToast.set(false);
      this.router.navigate(['/']);
    }, 1500);

    const email = this.registerForm.get('email')?.value;

    const baseUserName = email.split('@')[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userName = `${baseUserName}${randomSuffix}`;

    const { confirmPassword, ...formValue } = this.registerForm.value;

    const registerRequest = {
      ...formValue,
      userName: userName
    };

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
  this.formErrors = {}; 
  Object.keys(this.registerForm.controls).forEach(key => {
    const controlErrors = this.registerForm.get(key)?.errors;
    if (controlErrors) {
      if (controlErrors['required']) {
          this.formErrors[key] = 'This field is required.';
      }
      else if (key === 'displayName' && controlErrors['minlength']) {
          this.formErrors[key] = 'Display name must be at least 3 characters.';
      }
      else if (key === 'email' && controlErrors['email']) {
          this.formErrors[key] = 'Please enter a valid email.';
      }
      
      else if (key === 'password') {
        if (controlErrors['minlength']) {
           this.formErrors[key] = 'Password must be at least 6 characters.';
        } 
        else if (controlErrors['pattern']) {
           this.formErrors[key] = 'Password must contain uppercase, lowercase, number, and a special character (e.g. @#$%).';
        }
      }

      else if (key === 'confirmPassword' && controlErrors['mismatch']) {
          this.formErrors[key] = 'Passwords do not match.';
      }
      else if (key === 'dateOfBirth' && controlErrors['minAge']) {
          this.formErrors[key] = `You must be at least ${controlErrors['minAge'].requiredAge} years old.`;
      }
      else if (key === 'nationalityId' && controlErrors['min']) {
          this.formErrors[key] = 'Please select a valid nationality.';
      }
    }
  });

  if (this.registerForm.get('email')?.hasError('emailTaken')) {
      this.formErrors['email'] = 'This email is already taken.';
  }
}
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.html',
styleUrls: ['./reset-password.css']

})
export class ResetPassword {
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
}


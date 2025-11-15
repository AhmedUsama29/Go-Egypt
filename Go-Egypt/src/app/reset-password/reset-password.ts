import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink],
  templateUrl: './reset-password.html',
styleUrls: ['./reset-password.css']

})
export class ResetPassword {
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
}


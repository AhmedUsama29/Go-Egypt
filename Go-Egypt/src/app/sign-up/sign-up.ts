import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  imports: [],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Signup submitted');
  }
  
}

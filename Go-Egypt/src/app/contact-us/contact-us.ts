import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css'],
})
export class ContactUs {
  currentYear = new Date().getFullYear();

  handleSubmit(e: Event) {

    console.log('handleSubmit function started!');

    e.preventDefault();

    emailjs
      .sendForm(
        'service_4l8fprv',
        'template_hq7ayme',
        e.target as HTMLFormElement,
        '19tEfZrePnRB45S7a'
      )
      .then(
        (result) => {
          console.log(result.text);
          alert('Message sent successfully');
          (e.target as HTMLFormElement).reset();
        },
        (error) => {
          console.error(error.text);
          alert('Error occurred');
        }
      );
  }
}
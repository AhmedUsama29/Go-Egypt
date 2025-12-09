import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, TravelPackage } from '../booking';
import { CommonModule } from '@angular/common';
import { Stepper } from '../stepper/stepper';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, Stepper],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class Confirmation implements OnInit {

  selectedPackage: TravelPackage | null = null;
  bookingReference: number = 0;
  bookingForm: any;

  constructor(private router: Router, private bookingService: Booking) {}

  ngOnInit(): void {
    this.selectedPackage = this.bookingService.getSelectedPackage();
    if (!this.selectedPackage) {
      this.router.navigate(['/book']);
      return;
    }
    this.bookingReference = Math.floor(100000 + Math.random() * 900000);
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  printConfirmation() {
    window.print();
  }
  showToast = false;

confirmBooking(event: Event) {
  event.preventDefault(); 
  if (this.bookingForm?.form.valid) {
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.completeBooking();
    }, 3500);
  }
}

completeBooking() {
  this.router.navigate(['/book/confirmation']);
}

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, TravelPackage } from '../booking';
import { CommonModule } from '@angular/common';
import { Stepper } from '../stepper/stepper';
import { BookingResponse } from '../../services/booking-api';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, Stepper],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class Confirmation implements OnInit {
  selectedPackage: TravelPackage | null = null;
  booking: BookingResponse | null = null;

  constructor(private router: Router, private bookingService: Booking) {}

  ngOnInit(): void {
    this.selectedPackage = this.bookingService.getSelectedPackage();
    this.booking = this.bookingService.getLatestBooking();

    if (!this.selectedPackage || !this.booking) {
      this.router.navigate(['/book']);
      return;
    }
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  printConfirmation() {
    window.print();
  }
}

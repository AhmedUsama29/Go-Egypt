import { Component, model, OnInit } from '@angular/core';
import { Booking, TravelPackage, TravelerInfo, TripDetails, PaymentInfo} from '../booking';
import { CommonModule } from '@angular/common';
import { Stepper } from '../stepper/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule , Stepper],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation implements OnInit {

  selectedPackage: TravelPackage | null = null;
  travelerInfo: TravelerInfo | null = null;
  tripDetails: TripDetails | null = null;
  paymentInfo: PaymentInfo | null = null;

  constructor(private bookingService: Booking , private roueter : Router) {}

  ngOnInit(): void {
    this.selectedPackage = this.bookingService.getSelectedPackage();
    this.travelerInfo = this.bookingService.getTravelerInfo();
    this.tripDetails = this.bookingService.getTripDetails();
    this.paymentInfo = this.bookingService.getPaymentInfo();
  }

  getCardStars(): string {
    return '**** **** **** ';
  }

  onConfirm(): void {
    // FIX: Removed alert('...'). 
    // The alert() was blocking the thread and was not needed.
    // The modal is now closed by data-bs-dismiss="modal" in the HTML.
    // After the modal closes, this click event fires and navigates home.
    this.roueter.navigate(['/']);
  }

  onCancel(): void {
    // FIX: Removed alert('...').
    this.roueter.navigate(['/']);
  }
}
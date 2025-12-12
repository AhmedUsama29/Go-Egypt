import { Component } from '@angular/core';
import { Booking, TravelPackage } from '../booking';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stepper } from '../stepper/stepper';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule, Stepper],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  selectedPackage: TravelPackage | null = null;

  traveler = {
    firstName: '',
    lastName: '',
    phone: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  };

  availableTimes: string[] = [];
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private bookingService: Booking,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.selectedPackage = this.bookingService.getSelectedPackage();
    if (!this.selectedPackage) {
      this.router.navigate(['/book']);
    }
  }

  back() {
    this.router.navigate(['/book-now']);
  }

  onDateChange() {
    if (!this.traveler.startDate) {
      this.availableTimes = [];
      return;
    }

    this.availableTimes = [
      '09:00 AM',
      '11:00 AM',
      '01:00 PM',
      '03:00 PM',
      '05:00 PM'
    ];
  }

  get quotedPrice(): number {
    if (!this.selectedPackage || !this.traveler.startDate) {
      return 0;
    }

    const endDate = this.traveler.endDate || this.traveler.startDate;

    return this.bookingService.calculateQuote(
      this.traveler.adults,
      this.traveler.children,
      this.traveler.startDate,
      endDate,
      this.selectedPackage.category
    );
  }

  completeBooking() {
    if (!this.selectedPackage || !this.traveler.startDate) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const endDate = this.traveler.endDate || this.traveler.startDate;

    const payload = {
      attractionId: this.selectedPackage.id,
      startDate: this.traveler.startDate,
      endDate,
      adults: this.traveler.adults,
      children: this.traveler.children,
      totalPrice: this.quotedPrice,
      contactPhone: this.traveler.phone,
      notes: this.traveler.specialRequests
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.bookingService.setLatestBooking(booking);
        if (booking.paymentClientSecret) {
          this.router.navigate(['/book/payment'], { queryParams: { cs: booking.paymentClientSecret } });
        } else {
          this.router.navigate(['/book/confirmation']);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.error || 'Unable to place booking. Please try again.';
      }
    });
  }
}


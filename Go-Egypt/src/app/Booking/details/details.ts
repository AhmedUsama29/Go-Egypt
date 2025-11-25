import { Component } from '@angular/core';
import { Booking , TravelPackage } from '../booking';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stepper } from '../stepper/stepper';

@Component({
  selector: 'app-details',
  imports: [CommonModule,FormsModule,Stepper],
  templateUrl: './details.html',
  styleUrl: './details.css'
})

export class Details {

  packages: Record<string, TravelPackage> = {
    cairo: {
      id: 'cairo',
      name: 'Cairo & Giza Explorer',
      days: '3 days',
      desc: 'Explore the wonders of Cairo and Giza, including the Great Pyramids, Sphinx, and Egyptian Museum.',
      price: '$499 per person',
      img: 'assets/Giza.jpg',
    },
    nile: {
      id: 'nile',
      name: 'Nile Adventure',
      days: '3 days',
      desc: 'Cruise down the Nile River and discover the ancient temples of Luxor and Aswan.',
      price: '$599 per person',
      img: 'assets/Nile.jpg',
    },
    redsea: {
      id: 'redsea',
      name: 'Red Sea Retreat',
      days: '4 days',
      desc: 'Relax on the beautiful beaches of Hurghada and snorkel in the crystal-clear waters of the Red Sea.',
      price: '$799 per person',
      img: 'assets/Redsea.jpg',
    },
  };

  selectedPackage: TravelPackage | null = null;

  traveler = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startDate: '',
    startTime: '',
    travelers: 1,
    specialRequests: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(private router: Router , private bookingService : Booking) {
    const packageKey = this.router.getCurrentNavigation()?.extras?.state?.['package'];
    if (packageKey && this.packages[packageKey]) {
      this.selectedPackage = this.packages[packageKey];
    }
  }

    ngOnInit(): void {
    this.selectedPackage = this.bookingService.getSelectedPackage();
    if (!this.selectedPackage) {
      this.router.navigate(['/book']);
    }
  }
  back() {
    this.router.navigate(['/book-now']);
  }

  availableTimes: string[] = [];

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

showToast = false;

completeBooking() {
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
    this.router.navigate(['/book/confirmation']);
  }, 900);
}







}





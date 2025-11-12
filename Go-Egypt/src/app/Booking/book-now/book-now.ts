import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking , TravelPackage} from '../booking';
import { Stepper } from '../stepper/stepper';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-book-now',
  imports: [Stepper,CommonModule],
  templateUrl: './book-now.html',
  styleUrl: './book-now.css'
})

export class BookNow implements OnInit {

  packages: TravelPackage[] = [
    { id: 'cairo', name: 'Cairo & Giza Explorer', price: '$499', days: '3 days', desc: 'Explore the wonders of Cairo and Giza, including the Great Pyramids, Sphinx, and Egyptian Museum.', img: 'assets/Giza.jpg' },
    { id: 'nile', name: 'Nile Adventure', price: '$599', days: '3 days', desc: 'Cruise down the Nile River and discover the ancient temples of Luxor and Aswan.', img: 'assets/Nile.jpg' },
    { id: 'redsea', name: 'Red Sea Retreat', price: '$799', days: '4 days', desc: 'Relax on the beautiful beaches of Hurghada and snorkel in the crystal-clear waters of the Red Sea.', img: 'assets/Redsea.jpg' }
  ];

  selectedPackageId: string | null = null;

  constructor(private bookingService: Booking, private router: Router) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const preselected = urlParams.get('package');
    if (preselected) {
      this.selectedPackageId = preselected;
    }
  }

  selectPackage(pkg: TravelPackage) {
    this.selectedPackageId = pkg.id;
    this.bookingService.setSelectedPackage(pkg);
  }

  continue() {
    if (this.selectedPackageId) {
      this.router.navigate(['/book/details']);
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, TravelPackage } from '../booking';
import { Stepper } from '../stepper/stepper';
import { CommonModule } from '@angular/common';
import { AttractionService, CardAttractions } from '../../services/attraction';

@Component({
  selector: 'app-book-now',
  imports: [Stepper, CommonModule],
  templateUrl: './book-now.html',
  styleUrl: './book-now.css'
})
export class BookNow implements OnInit {
  packages: TravelPackage[] = [];
  selectedPackageId: number | null = null;
  isLoading = false;

  constructor(
    private bookingService: Booking,
    private router: Router,
    private attractionService: AttractionService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  private loadPackages() {
    this.isLoading = true;
    this.attractionService.getAttractions(1, 6).subscribe({
      next: (response) => {
        this.packages = response.data.map((a) => this.mapAttractionToPackage(a));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private mapAttractionToPackage(attraction: CardAttractions): TravelPackage {
    const pricePerAdult = attraction.price ?? 120;
    return {
      id: attraction.id,
      name: attraction.name,
      location: attraction.location,
      category: attraction.category,
      price: attraction.price,
      pricePerAdult,
      days: '1 day',
      desc: attraction.overview,
      img: attraction.mainPhotoPath
    };
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

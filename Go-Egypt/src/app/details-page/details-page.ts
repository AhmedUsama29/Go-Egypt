import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AttractionService, AttractionDetails } from '../services/attraction';
import { Booking, TravelPackage } from '../Booking/booking';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details-page.html',
  styleUrl: './details-page.css'
})
export class DetailsPage implements OnInit { 
  
  activeImageIndex = 0;
  
  attractionDetails?: AttractionDetails;

  constructor(
    private route: ActivatedRoute,
    private attractionService: AttractionService,
    private bookingService: Booking,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const id = +idParam; 
      
      this.attractionService.getAttractionById(id).subscribe(details => {
        this.attractionDetails = details;
        console.log(details); 
      });
    }
  }


  nextImage() {
   
    if (this.attractionDetails && this.attractionDetails.gallery.length > 0) {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.attractionDetails.gallery.length;
    }
  }

  prevImage() {
    if (this.attractionDetails && this.attractionDetails.gallery.length > 0) {
      this.activeImageIndex =
        this.activeImageIndex === 0 ? this.attractionDetails.gallery.length - 1 : this.activeImageIndex - 1;
    }
  }

  setImage(index: number) {
    this.activeImageIndex = index;
  }

startBooking() {
    if (!this.attractionDetails) return;

    const pkg: TravelPackage = {
      id: this.attractionDetails.id,
      name: this.attractionDetails.name,
      location: this.attractionDetails.location,
      category: this.attractionDetails.category,
      price: this.attractionDetails.price,
      pricePerAdult: this.attractionDetails.price ?? 120,
      days: '1 day',
      desc: this.attractionDetails.overview,
      img: this.attractionDetails.mainPhotoPath
    };

    // 2. حفظ الباكدج في السيرفس (عشان الصفحة الجاية تقرأها)
    this.bookingService.setSelectedPackage(pkg);

    // 3. التوجيه مباشرة للصفحة الثانية في الـ Stepper (تخطي صفحة الاختيار)
    this.router.navigate(['/book/details']);
  }
}
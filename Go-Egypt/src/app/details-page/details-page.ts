import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AttractionService, AttractionDetails } from '../services/attraction'; 

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
    private attractionService: AttractionService
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
}
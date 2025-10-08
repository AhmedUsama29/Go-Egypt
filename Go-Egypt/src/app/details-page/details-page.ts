import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-details-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './details-page.html',
  styleUrl: './details-page.css'
})

export class DetailsPage {
  activeImageIndex = 0;

  location = {
    name: 'Pyramids of Giza',
    rating: 4.9,
    location: 'Giza',
    hours: '8:00 AM - 5:00 PM',
    heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1600',
    description: 'The Pyramids of Giza complex is an archaeological site on the Giza Plateau, just outside Cairo, Egypt. It includes the Great Pyramid of Khufu, the Pyramid of Khafre, and the Pyramid of Menkaure — all built during the Fourth Dynasty of the Old Kingdom.',
    keyFacts: [
      { title: 'History', content: 'Built during the Fourth Dynasty of the Old Kingdom of Ancient Egypt around 2600 BC.' },
      { title: 'Architecture', content: 'Constructed with 2.3 million limestone blocks, each weighing up to 15 tons.' },
      { title: 'Cultural Significance', content: 'They served as monumental tombs for pharaohs, symbolizing Egypt’s grandeur.' },
      { title: 'Surrounding Area', content: 'Includes the Great Sphinx and several temples and smaller pyramids.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1600',
      'https://images.unsplash.com/photo-1590133146482-7d2cb0b2d11d?w=1600',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600',
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1600'
    ]
  };

  nextImage() {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.location.gallery.length;
  }

  prevImage() {
    this.activeImageIndex =
      this.activeImageIndex === 0 ? this.location.gallery.length - 1 : this.activeImageIndex - 1;
  }

  setImage(index: number) {
    this.activeImageIndex = index;
  }
}

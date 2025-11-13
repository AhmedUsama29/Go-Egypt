import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  currentIndex = 0;
  
  cards = [
    {
      image: 'assets/img1.wallspic.com-archaeological_site-landscape-pyramid-great_pyramid_of_giza-pharaoh-3182x2116.jpg',
      title: 'The Great Pyramids',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    },
    {
      image: 'assets/img2.wallspic.com-historic_site-ancient_history-ancient_egypt-archaeological_site-nile-3221x2142.jpg',
      title: 'Nile River Temples',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    },
    {
      image: 'assets/img3.wallspic.com-great_pyramid_of_giza-monument-historic_site-wonders_of_the_world-egyptian_pyramids-2880x1800.jpg',
      title: 'Ancient Monuments',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
    },
    {
      image: 'assets/img1.wallspic.com-archaeological_site-landscape-pyramid-great_pyramid_of_giza-pharaoh-3182x2116.jpg',
      title: 'Desert Wonders',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    },
    {
      image: 'assets/img2.wallspic.com-historic_site-ancient_history-ancient_egypt-archaeological_site-nile-3221x2142.jpg',
      title: 'Historical Sites',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
    },
    {
      image: 'assets/img3.wallspic.com-great_pyramid_of_giza-monument-historic_site-wonders_of_the_world-egyptian_pyramids-2880x1800.jpg',
      title: 'Egyptian Heritage',
      description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    }
  ];

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  getVisibleCardsArray() {
    const visibleCount = this.getVisibleCards();
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (this.currentIndex + i) % this.cards.length;
      result.push(this.cards[index]);
    }
    return result;
  }

  getVisibleCards(): number {
    if (window.innerWidth >= 992) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }
}
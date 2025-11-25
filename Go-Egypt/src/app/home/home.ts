import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttractionService, HomeAttractions } from '../services/attraction';
import { Hero } from './hero/hero';

interface Governorate {
  name: string;
  image: string;
  attractionCount: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink , CommonModule, Hero],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  destinations: HomeAttractions[] = [];

  governorates: Governorate[] = [
    { name: 'Cairo', image: 'assets/cairo.jpg', attractionCount: 42 },
    { name: 'Luxor', image: 'assets/luxer.jpg', attractionCount: 36 }, 
    { name: 'Aswan', image: 'assets/Aswan.jpg', attractionCount: 28 },
    { name: 'Alexandria', image: 'assets/Alxa.jpg', attractionCount: 31 },
    { name: 'Sharm El Sheikh', image: 'assets/Sharm El sheikh.jpg', attractionCount: 24 },
    { name: 'Hurghada', image: 'assets/hurgada.jpg', attractionCount: 22 }
  ];

  constructor(private attractionService: AttractionService) { }

  ngOnInit(): void {
    this.loadHomeAttractions();
  }

  loadHomeAttractions(): void {
    this.attractionService.getHomeAttractions().subscribe({
      next: (data) => {
        this.destinations = data.filter(d => d.mainPhotoPath);
      },
      error: (err) => {
        console.error('Failed to load home attractions', err);
      }
    });
  }
}
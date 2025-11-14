import { Component, OnInit } from '@angular/core'; // 1. حذف CUSTOM_ELEMENTS_SCHEMA
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttractionService, HomeAttractions } from '../services/attraction';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'

})
export class Home implements OnInit {

  destinations: HomeAttractions[] = [];

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
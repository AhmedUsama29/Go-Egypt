import { Component, OnInit } from '@angular/core'; 
import { CommonModule, ViewportScroller } from '@angular/common'; 
import { AttractionService, PaginatedResponse, CardAttractions } from '../services/attraction'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-attraction',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './attraction.html',
  styleUrl: './attraction.css'
})
export class Attraction implements OnInit { 

  attractionsResponse?: PaginatedResponse<CardAttractions>;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  pages: number[] = [];

  categories: string[] = ['Historical', 'Cultural', 'Nature', 'Religious', 'Entertainment'];
  selectedCategory: string = '';

  constructor(private attractionService: AttractionService,
              private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.loadAttractions(); 
  }

  loadAttractions(): void {
    this.attractionService.getAttractions(this.currentPage, this.pageSize, this.selectedCategory)
      .subscribe(response => {
        this.attractionsResponse = response;
        this.totalPages = Math.ceil(response.count / this.pageSize);
        
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
        
        console.log(response); 
      });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadAttractions();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; 
      this.loadAttractions(); 
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; 
      this.loadAttractions(); 
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadAttractions();
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
}
import { Component, OnInit } from '@angular/core'; 
import { CommonModule, ViewportScroller } from '@angular/common'; 
import { AttractionService, PaginatedResponse, CardAttractions } from '../services/attraction'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-attraction',
  standalone: true, 
  imports: [CommonModule,RouterModule], 
  templateUrl: './attraction.html',
  styleUrl: './attraction.css'
})
export class Attraction implements OnInit { 

  attractionsResponse?: PaginatedResponse<CardAttractions>;
  
  // --- متغيرات الـ Pagination ---
  currentPage: number = 1;
  pageSize: number = 6; // يمكنك تغيير هذا الرقم (مثلاً 3 أو 9)
  totalPages: number = 0;
  
  // (جديد) Array عشان نحط فيه أرقام الصفحات
  pages: number[] = [];

  constructor(private attractionService: AttractionService,
              private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.loadAttractions(); 
  }

  /**
   * الفانكشن الأساسية لجلب الداتا
   */
  loadAttractions(): void {
    this.attractionService.getAttractions(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.attractionsResponse = response;
        this.totalPages = Math.ceil(response.count / this.pageSize);
        
        // (جديد) نملى الـ Array بالأرقام من 1 إلى totalPages
        // .fill(0) .map(...) هي طريقة سريعة لإنشاء مصفوفة أرقام [1, 2, 3]
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
        
        console.log(response); 
      });
  }

  // --- فانكشنز أزرار التحكم ---

  /**
   * ينتقل للصفحة التالية
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; 
      this.loadAttractions(); 
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  /**
   * يرجع للصفحة السابقة
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; 
      this.loadAttractions(); 
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  /**
   * (جديد) فانكشن عشان تروح لرقم صفحة معين
   */
  goToPage(page: number): void {
    // نتأكد إن الصفحة المطلوبة في النطاق الصحيح وإنها مش نفس الصفحة الحالية
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadAttractions();
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
}
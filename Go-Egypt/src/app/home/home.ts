import { Component, OnInit, HostListener } from '@angular/core'; // 1. استيراد HostListener
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttractionService, HomeAttractions } from '../services/attraction';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // --- بيانات الـ API ---
  destinations: HomeAttractions[] = [];

  // --- لوجيك الكاروسيل ---
  currentIndex: number = 0;
  cardsToShow: number = 4; // الافتراضي للشاشات الكبيرة

  // 8. حقن السيرفس في الـ Constructor
  constructor(private attractionService: AttractionService) { }

  // 9. عند تحميل الكومبوننت
  ngOnInit(): void {
    this.checkScreenSize(); // 1. تحقق من حجم الشاشة أول مرة
    this.loadHomeAttractions(); // 2. جلب البيانات
  }

  // 10. دالة جلب البيانات من السيرفس
  loadHomeAttractions(): void {
    this.attractionService.getHomeAttractions().subscribe({
      next: (data) => {
        this.destinations = data;
      },
      error: (err) => {
        console.error('Failed to load home attractions', err);
      }
    });
  }

  // === دوال الكاروسيل ===

  /**
   * 11. يستمع لأي تغيير في حجم الشاشة
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkScreenSize();
  }

  /**
   * 12. يحدد عدد الكروت بناءً على عرض الشاشة
   */
  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.cardsToShow = 1; // شاشة موبايل (col-sm-12)
    } else if (window.innerWidth < 992) {
      this.cardsToShow = 2; // شاشة تابلت (col-md-6)
    } else {
      this.cardsToShow = 4; // شاشة لابتوب (col-lg-3)
    }
  }

  /**
   * 13. الدالة التي يستخدمها *ngFor لتقطيع مصفوفة البيانات
   */
  getVisibleCardsArray(): HomeAttractions[] {
    return this.destinations.slice(this.currentIndex, this.currentIndex + this.cardsToShow);
  }

  /**
   * 14. دالة الزر الأيمن (Next)
   */
  next(): void {
    // تحقق أننا لم نصل للنهاية
    if (this.currentIndex + this.cardsToShow < this.destinations.length) {
      this.currentIndex++;
    }
  }

  /**
   * 15. دالة الزر الأيسر (Prev)
   */
  prev(): void {
    // تحقق أننا لم نتجاوز البداية
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
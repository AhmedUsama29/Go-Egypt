import { Component, OnInit } from '@angular/core'; // 1. استيراد OnInit
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

// 2. استيراد السيرفس والـ Interface من الملف الذي أنشأناه سابقاً
import { AttractionService, AttractionDetails } from '../services/attraction'; 

@Component({
  selector: 'app-details-page',
  standalone: true, // 3. إضافة Standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './details-page.html',
  styleUrl: './details-page.css'
})
export class DetailsPage implements OnInit { // 4. تطبيق OnInit
  
  activeImageIndex = 0;
  
  // 5. حذف الداتا الثابتة، واستبدالها بمتغير سيستقبل الداتا
  attractionDetails?: AttractionDetails;

  // 6. عمل Inject للـ ActivatedRoute (لقراءة الـ ID) و الـ Service (لجلب الداتا)
  constructor(
    private route: ActivatedRoute,
    private attractionService: AttractionService
  ) {}

  // 7. عند تحميل الكومبوننت، نفذ هذا الكود
  ngOnInit(): void {
    // 8. اقرأ الـ 'id' من الـ URL
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      // 9. حوّل الـ id (اللي بيكون string) إلى رقم
      const id = +idParam; 
      
      // 10. استدعِ الفانكشن من السيرفس
      this.attractionService.getAttractionById(id).subscribe(details => {
        // 11. عند وصول الداتا، خزّنها في المتغير
        this.attractionDetails = details;
        console.log(details); // تأكد أن الداتا وصلت في الـ Console
      });
    }
  }

  // --- 12. تعديل فانكشنز الجاليري لتعمل مع الداتا الجديدة ---

  nextImage() {
    // نتأكد أن الداتا موجودة قبل محاولة قراءتها
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
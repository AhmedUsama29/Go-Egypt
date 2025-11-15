import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- 1. إضافة FormsModule
import { ProfileService , ProfileResponse, ProfileEditRequest} from '../services/profile';

@Component({
  selector: 'app-profile',
  // 2. إضافة FormsModule للـ imports
  imports: [CommonModule, FormsModule], 
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  profileImage: string | null = null;
  isEditing = false;
  
  userData: ProfileResponse | null = null; // <-- 3. استخدام الـ Interface
  
  // 4. متغير مؤقت لحفظ بيانات الفورم وقت التعديل
  editData: ProfileEditRequest = {
    displayName: '',
    about: '',
    photoLocation: ''
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getProfileDetails().subscribe({
      next: (data: ProfileResponse) => {
        this.userData = data;
        this.profileImage = data.profilePicture; // بنعرض الصورة اللي جاية من الباك اند
      },
      error: (err) => console.error('Error loading profile data:', err)
    });
  }

  handleImageUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file || !this.userData) return;

    // 1. (الخطوة 1) رفع الصورة للـ Server
    this.profileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        const newImageUrl = response.newUrl; // (الخطوة 3) استقبلنا المسار
        this.profileImage = newImageUrl; 
        this.userData!.profilePicture = newImageUrl; // تحديث الصورة في الداتا

        // 2. (الخطوة 3) حفظ الـ URL الجديد في البروفايل
        const editRequest: ProfileEditRequest = {
          displayName: this.userData!.displayName,
          about: this.userData!.about,
          photoLocation: newImageUrl // بنبعت اللينك الجديد
        };

        this.profileService.editProfile(editRequest).subscribe({
          next: () => console.log('Profile picture updated successfully!'),
          error: (err) => console.error('Error saving new profile picture URL:', err)
        });
      },
      error: (err) => console.error('Error uploading image:', err)
    });
  }

  // --- 5. تنفيذ الـ Logic المطلوب ---

  toggleEdit(): void {
    this.isEditing = true;
    if (this.userData) {
      // بنحط الداتا الحالية في الفورم المؤقت
      this.editData = {
        displayName: this.userData.displayName,
        about: this.userData.about,
        photoLocation: this.userData.profilePicture
      };
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    // مفيش حفظ، رجع كل حاجة زي ما كانت (لو عدلنا الصورة مؤقتاً)
    if (this.userData) {
      this.profileImage = this.userData.profilePicture;
    }
  }

  saveProfile(): void {
    if (!this.editData || !this.userData) return;

    // بنجهز الـ Request بالبيانات الجديدة من الفورم
    const request: ProfileEditRequest = {
      displayName: this.editData.displayName,
      about: this.editData.about,
      // photoLocation بيتم تحديثه من handleImageUpload لوحده
      // فاحنا هنبعت اللي موجود في الداتا الرئيسية
      photoLocation: this.userData.profilePicture 
    };

    this.profileService.editProfile(request).subscribe({
      next: (success) => {
        if (success) {
          // لو نجح، حدث الداتا الرئيسية
          this.userData!.displayName = this.editData.displayName;
          this.userData!.about = this.editData.about;
          // الخروج من وضع التعديل
          this.isEditing = false;
        } else {
          console.error('Failed to save profile (backend returned false)');
        }
      },
      error: (err) => console.error('Error saving profile:', err)
    });
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService, ProfileResponse, ProfileEditRequest } from '../services/profile';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  // هنستخدم ده عشان نعرض الصورة كاملة
  serverBaseUrl = 'https://localhost:7212';

  profileImage: string | null = null; // ده المتغير المسئول عن عرض الصورة في الصفحة دي
  isEditing = false;
  userData: ProfileResponse | null = null;

  editData: ProfileEditRequest = {
    displayName: '',
    about: '',
    photoLocation: ''
  };

  constructor(public profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getProfileDetails().subscribe({
      next: (data: ProfileResponse) => {
        this.userData = data;
        // بنحفظ الصورة في متغير محلي عشان نتحكم في الـ Preview
        this.profileImage = data.profilePicture;
      },
      error: (err) => console.error('Error loading profile data:', err)
    });
  }

  handleImageUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file || !this.userData) return;

    this.profileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        // هنا بنحدث المتغير المحلي بس (Preview)
        // الناف بار مش هيحس بحاجة لسه
        this.profileImage = response.newUrl; 
        this.editData.photoLocation = response.newUrl;
      },
      error: (err) => console.error('Error uploading image:', err)
    });
  }

  toggleEdit(): void {
    this.isEditing = true;
    if (this.userData) {
      this.editData = {
        displayName: this.userData.displayName,
        about: this.userData.about,
        photoLocation: this.userData.profilePicture 
      };
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    // هنا بنرجع الصورة للأصل اللي جاي من الداتا بيز
    if (this.userData) {
      this.profileImage = this.userData.profilePicture;
    }
  }

  saveProfile(): void {
    if (!this.editData || !this.userData) return;

    const request: ProfileEditRequest = {
      displayName: this.editData.displayName,
      about: this.editData.about,
      photoLocation: this.editData.photoLocation
    };

    this.profileService.editProfile(request).subscribe({
      next: (success) => {
        if (success) {
          // تحديث الداتا المحلية
          this.userData!.displayName = this.editData.displayName;
          this.userData!.about = this.editData.about;
          this.userData!.profilePicture = this.editData.photoLocation;
          
          // هام جداً: دلوقتي بس نحدث الناف بار (Global Signal)
          this.profileService.updateImageSignal(this.editData.photoLocation);

          this.isEditing = false;
        } else {
          console.error('Failed to save profile');
        }
      },
      error: (err) => console.error('Error saving profile:', err)
    });
  }
}
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

  serverBaseUrl = 'https://localhost:7212';

  profileImage: string | null = null;
  isEditing = false;

  userData: ProfileResponse | null = null;

  editData: ProfileEditRequest = {
    displayName: '',
    about: '',
    photoLocation: ''
  };

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getProfileDetails().subscribe({
      next: (data: ProfileResponse) => {
        this.userData = data;
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
        const newImageUrl = response.newUrl;

        this.profileImage = newImageUrl;

        this.editData.photoLocation = newImageUrl;

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
          this.userData!.displayName = this.editData.displayName;
          this.userData!.about = this.editData.about;
          this.userData!.profilePicture = this.editData.photoLocation;

          this.isEditing = false;
        } else {
          console.error('Failed to save profile (backend returned false)');
        }
      },
      error: (err) => console.error('Error saving profile:', err)
    });
  }
}
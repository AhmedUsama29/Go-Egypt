import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

profileImage: string | null = null;
  isEditing = false;

  userData = {
    displayName: 'Tarek Magdy',
    email: 'Tarek.MAgdy@gmail.com',
    dateOfBirth: 'May 15, 1990',
    gender: 'Male',
    nationality: 'Egypt',
    memberSince: 'January 2024',
    tripsBooked: 5,
    placesVisited: 3
  };

  handleImageUpload(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


export interface ProfileResponse {
  displayName: string;
  dateOfBirth: string; 
  gender: string;
  nationality: string;
  profilePicture: string;
  about: string;
  email: string;
}

export interface ProfileEditRequest {
  displayName: string;
  about: string;
  photoLocation: string;
}

@Injectable({
  providedIn: 'root'
})


export class ProfileService {
  
  private apiUrl = `https://localhost:7212/api/Profile`; 

  constructor(private http: HttpClient) { }


  getProfileDetails(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/details`);
  }


  editProfile(data: ProfileEditRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit`, data);
  }

uploadProfileImage(file: File): Observable<{ newUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name); 

    return this.http.post<{ newUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }

}

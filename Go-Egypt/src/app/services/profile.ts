import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

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
  private serverBaseUrl = 'https://localhost:7212';

  currentUserImage = signal<string>('');
  
  constructor(private http: HttpClient) { }

  getProfileDetails(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/details`).pipe(
      tap(res => {
        if(res.profilePicture) {
             this.updateImageSignal(res.profilePicture);
        }
      })
    );
  }

  editProfile(data: ProfileEditRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit`, data);
  }

  uploadProfileImage(file: File): Observable<{ newUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name); 
    return this.http.post<{ newUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }
  
  getProfilePicture(): Observable<string> {
    return this.http.get(`${this.apiUrl}/profile-picture`, { responseType: 'text' }).pipe(
        tap(url => {
            this.updateImageSignal(url);
        })
    );
  }

  public updateImageSignal(path: string) {
    if (path && path.trim() !== '') {
        const fullUrl = path.startsWith('http') ? path : `${this.serverBaseUrl}${path}`;
        this.currentUserImage.set(fullUrl);
    } else {
        this.currentUserImage.set('');
    }
  }

  clearUserData() {
      this.currentUserImage.set('');
  }
}
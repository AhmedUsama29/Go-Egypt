import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface UserResponse {
  token: string;
  id: string;
  email: string;
  displayName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/Authentication`;

  login(payload: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register`, payload);
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/emailExists`, { params: { email } });
  }

  getUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/getUser`);
  }
}



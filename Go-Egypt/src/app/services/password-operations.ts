import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class PasswordOperations {

  private apiUrl = 'https://localhost:7212/api/Authentication';

  constructor(private http: HttpClient) { }

 
  forgotPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgotPassword`;
    
    const body: ForgotPasswordRequest = {
      email: email
    };
    
    return this.http.post(url, body);
  }


  resetPassword(requestData: ResetPasswordRequest): Observable<any> {
    const url = `${this.apiUrl}/resetPassword`;
    
    return this.http.post(url, requestData);
  }
}
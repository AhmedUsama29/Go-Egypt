import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  private apiUrl = 'https://localhost:7212/api/Authentication'

  isLoggedInSignal = signal<boolean>(this.isLoggedIn()); 
  userNameSignal = signal<string | null>(null);

  constructor(private http : HttpClient){
    if (this.isLoggedInSignal()) {
      this.decodeAndSetUser();
    }
  }

  login(credentials: any){
      return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token); 
          this.isLoggedInSignal.set(true);
          this.decodeAndSetUser(response.token);
        })
      );
    }

    register(userInfo: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userInfo);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedInSignal.set(false);
    this.userNameSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  private decodeAndSetUser(tokenString?: string) {
    const token = tokenString || this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        
      const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']; 
      this.userNameSignal.set(name || 'User');

      } catch (e) {
        console.error("invalid Token", e);
        this.logout();
      }
    }
  }
}

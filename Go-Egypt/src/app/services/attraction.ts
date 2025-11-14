import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces (DTOs) ---

export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number; // العدد الإجمالي
  data: T[]; // الداتا
}

export interface HomeAttractions {
  id: number;
  name: string;
  mainPhotoPath: string;
  location: string;
  openingTime: string; // C# TimeOnly تتحول إلى string في JSON
  closingTime: string; // C# TimeOnly تتحول إلى string في JSON
}

export interface CardAttractions {
  id: number;
  name: string;
  location: string;
  openingTime: string;
  closingTime: string;
  overview: string;
  mainPhotoPath: string;
  category: string;
}

export interface KeyFact {
  headline: string;
  description: string;
}

export interface AttractionDetails {
  id: number;
  name: string;
  location: string;
  overview: string;
  openingTime: string;
  closingTime: string;
  mainPhotoPath: string;
  category: string;
  gallery: string[];
  keyFacts: KeyFact[];
}

// --- Service Class ---

@Injectable({
  providedIn: 'root'
})
export class AttractionService { 

  // تأكد أن البورت (7212) صحيح
  private apiUrl = 'https://localhost:7212/api/Attraction'; 

  constructor(private http: HttpClient) { }

  /**
   * يجلب قائمة المعالم السياحية مع Pagination
   */
  getAttractions(page: number, size: number): Observable<PaginatedResponse<CardAttractions>> {
    
    return this.http.get<PaginatedResponse<CardAttractions>>(
      `${this.apiUrl}/GetAllCardAttractions`, 
      {
        params: {
          PageIndex: page.toString(),
          PageSize: size.toString()
        }
      }
    );
  }

getHomeAttractions(): Observable<HomeAttractions[]> {
    return this.http.get<HomeAttractions[]>(
      `${this.apiUrl}/GetHomeAttractions`
    );
  }

  /**
   * يجلب تفاصيل معلم سياحي واحد
   */
  getAttractionById(id: number): Observable<AttractionDetails> {
    
    return this.http.get<AttractionDetails>(
      `${this.apiUrl}/GetAttractionById/${id}`
    );
  }
}
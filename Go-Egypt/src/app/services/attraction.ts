import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // 1. ضيفنا HttpParams
import { Observable } from 'rxjs';

// --- Interfaces (DTOs) ---
export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface HomeAttractions {
  id: number;
  name: string;
  mainPhotoPath: string;
  location: string;
  openingTime: string;
  closingTime: string;
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

@Injectable({
  providedIn: 'root'
})
export class AttractionService { 

  private apiUrl = 'https://localhost:7212/api/Attraction'; 

  constructor(private http: HttpClient) { }

  getAttractions(page: number, size: number, category?: string): Observable<PaginatedResponse<CardAttractions>> {
    
    let params = new HttpParams()
      .set('PageIndex', page.toString())
      .set('PageSize', size.toString());

    if (category) {
      params = params.set('Category', category);
    }

    return this.http.get<PaginatedResponse<CardAttractions>>(
      `${this.apiUrl}/GetAllCardAttractions`, 
      { params }
    );
  }

  getHomeAttractions(): Observable<HomeAttractions[]> {
    return this.http.get<HomeAttractions[]>(
      `${this.apiUrl}/GetHomeAttractions`
    );
  }

  getAttractionById(id: number): Observable<AttractionDetails> {
    return this.http.get<AttractionDetails>(
      `${this.apiUrl}/GetAttractionById/${id}`
    );
  }
}
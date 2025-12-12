import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateBookingRequest {
  attractionId: number;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  contactPhone?: string | null;
  notes?: string | null;
}

export interface BookingResponse {
  id: number;
  bookingReference: string;
  totalPrice: number;
  status: string;
  paymentClientSecret?: string | null;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  private apiUrl = 'https://localhost:7212/api/Bookings';

  constructor(private http: HttpClient) {}

  createBooking(payload: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, payload);
  }

  getBooking(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${id}`);
  }

  getMyBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/mine`);
  }
}


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingApiService, BookingResponse, CreateBookingRequest } from '../services/booking-api';

export interface TravelPackage {
  id: number;
  name: string;
  location: string;
  category: string;
  // kept for backward compatibility with older templates
  price?: number;
  pricePerAdult: number;
  days: string;
  desc: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class Booking {
  private selectedPackage: TravelPackage | null = null;
  private latestBooking: BookingResponse | null = null;

  constructor(private bookingApi: BookingApiService) {}

  setSelectedPackage(pkg: TravelPackage) {
    this.selectedPackage = pkg;
  }

  getSelectedPackage(): TravelPackage | null {
    return this.selectedPackage;
  }

  setLatestBooking(booking: BookingResponse) {
    this.latestBooking = booking;
  }

  getLatestBooking(): BookingResponse | null {
    return this.latestBooking;
  }

  calculateQuote(adults: number, children: number, startDate: string, endDate: string, category: string): number {
    const baseAdultPrice = this.selectedPackage?.pricePerAdult ?? 120;
    const childDiscountFactor = 0.5;
    const durationMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    const days = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

    const multiplier = category.toLowerCase() === 'adventure'
      ? 1.2
      : category.toLowerCase() === 'beach'
        ? 1.1
        : 1.0;

    const adultsPrice = adults * baseAdultPrice;
    const childrenPrice = children * baseAdultPrice * childDiscountFactor;

    return Math.round(((adultsPrice + childrenPrice) * days * multiplier) * 100) / 100;
  }

  createBooking(payload: CreateBookingRequest): Observable<BookingResponse> {
    return this.bookingApi.createBooking(payload);
  }

  clear() {
    this.selectedPackage = null;
    this.latestBooking = null;
  }
}

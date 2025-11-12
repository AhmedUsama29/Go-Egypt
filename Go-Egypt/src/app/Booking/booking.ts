import { Injectable } from '@angular/core';

export interface TravelPackage {
  id: string;
  name: string;
  price: string;
  days: string;
  desc: string;
  img: string;
}

export interface TravelerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TripDetails {
  startDate: string;
  numberOfTravelers: number;
  specialRequests?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

@Injectable({
  providedIn: 'root'
})
export class Booking {
  private selectedPackage: TravelPackage | null = null;
  private travelerInfo: TravelerInfo | null = null;
  private tripDetails: TripDetails | null = null;
  private paymentInfo: PaymentInfo | null = null;

  // === Package ===
  setSelectedPackage(pkg: TravelPackage) {
    this.selectedPackage = pkg;
  }
  getSelectedPackage(): TravelPackage | null {
    return this.selectedPackage;
  }

  // === Traveler Info ===
  setTravelerInfo(info: TravelerInfo) {
    this.travelerInfo = info;
  }
  getTravelerInfo(): TravelerInfo | null {
    return this.travelerInfo;
  }

  // === Trip Details ===
  setTripDetails(details: TripDetails) {
    this.tripDetails = details;
  }
  getTripDetails(): TripDetails | null {
    return this.tripDetails;
  }

  // === Payment Info ===
  setPaymentInfo(payment: PaymentInfo) {
    this.paymentInfo = payment;
  }
  getPaymentInfo(): PaymentInfo | null {
    return this.paymentInfo;
  }

  // === Combined method to set everything at once ===
  setBookingDetails(
    pkg: TravelPackage,
    traveler: TravelerInfo,
    trip: TripDetails,
    payment: PaymentInfo
  ) {
    this.selectedPackage = pkg;
    this.travelerInfo = traveler;
    this.tripDetails = trip;
    this.paymentInfo = payment;
  }

  // === Clear all booking data ===
  cancelBooking() {
    this.selectedPackage = null;
    this.travelerInfo = null;
    this.tripDetails = null;
    this.paymentInfo = null;
  }
}

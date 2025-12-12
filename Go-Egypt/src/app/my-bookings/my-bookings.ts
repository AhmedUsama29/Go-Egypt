import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingApiService, UserBookingDto } from '../services/booking-api';

// شكل الداتا اللي الـ HTML محتاجها (View Model)
interface BookingViewModel {
  id: string;
  destination: string;
  location: string;
  image: string;
  bookingDate: string;
  travelDate: string;
  guests: number;
  price: number;
  status: string;
  bookingReference: string;
}

type FilterType = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {
  
  private bookingService = inject(BookingApiService);

  // تعريف الفلاتر
  filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  activeFilter = signal<FilterType>('all');
  isLoading = signal<boolean>(true); // عشان نعرض Loading State
  bookings = signal<BookingViewModel[]>([]); // الداتا الأساسية

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        // تحويل كل عنصر جاي من الباك إند للشكل اللي الـ HTML عايزه
        const mappedBookings = response.map(b => this.mapToViewModel(b));
        this.bookings.set(mappedBookings);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.isLoading.set(false);
      }
    });
  }

  // دالة التحويل (Mapping) من DTO لـ ViewModel
  private mapToViewModel(dto: UserBookingDto): BookingViewModel {
    return {
      id: dto.id.toString(),
      destination: dto.attractionName || 'Unknown Destination', // الاسم من DTO الجديد
      location: dto.attractionLocation || 'Egypt',
      // صورة احتياطية لو مفيش صورة جاية
      image: dto.attractionImage || 'assets/images/placeholder.jpg', 
      bookingDate: new Date(dto.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      travelDate: new Date(dto.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      guests: (dto.adults || 0) + (dto.children || 0),
      price: dto.totalPrice,
      status: dto.status.toLowerCase(), // توحيد الحالة لحروف صغيرة
      bookingReference: dto.bookingReference
    };
  }

  // فلترة الداتا بناءً على التاب المختار
  filteredBookings = computed(() => {
    const filter = this.activeFilter();
    const allBookings = this.bookings();
    if (filter === 'all') return allBookings;
    return allBookings.filter(b => b.status === filter);
  });

  getBookingCount(status: FilterType): number {
    if (status === 'all') return this.bookings().length;
    return this.bookings().filter(b => b.status === status).length;
  }

  // إعدادات الألوان والأيقونات لكل حالة
  getStatusConfig(status: string) {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    switch (normalizedStatus) {
      case 'confirmed':
        return { label: 'Confirmed', icon: 'check-circle', bg: 'bg-blue-100', text: 'text-blue-700', iconColor: 'text-blue-600' };
      case 'completed':
        return { label: 'Completed', icon: 'check-circle', bg: 'bg-green-100', text: 'text-green-700', iconColor: 'text-green-600' };
      case 'pending':
        return { label: 'Pending', icon: 'alert-circle', bg: 'bg-yellow-100', text: 'text-yellow-700', iconColor: 'text-yellow-600' };
      case 'cancelled':
        return { label: 'Cancelled', icon: 'x-circle', bg: 'bg-gray-100', text: 'text-gray-700', iconColor: 'text-gray-600' };
      default:
        return { label: status, icon: 'alert-circle', bg: 'bg-gray-100', text: 'text-gray-700', iconColor: 'text-gray-600' };
    }
  }

  currentYear = new Date().getFullYear();
}
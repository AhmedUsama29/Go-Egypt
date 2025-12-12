import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment';
import { Booking } from '../booking';
import { StripeElements, StripePaymentElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  private elementsCleanup: (() => void) | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;
  isSubmitting = signal(false);
  errorMessage = signal('');
  clientSecret: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private bookingService: Booking
  ) {}

  async ngOnInit(): Promise<void> {
    this.clientSecret = this.route.snapshot.queryParamMap.get('cs') ||
      this.bookingService.getLatestBooking()?.paymentClientSecret ||
      null;

    if (!this.clientSecret) {
      this.errorMessage.set('Missing payment client secret. Please start a booking again.');
      return;
    }

    try {
      const { elements, paymentElement } = await this.paymentService.createPaymentElement(this.clientSecret);
      this.elements = elements;
      this.paymentElement = paymentElement;
      this.paymentElement.mount('#payment-element');
      this.elementsCleanup = () => this.paymentElement?.unmount();
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Failed to initialize payment form.');
    }
  }

  ngOnDestroy(): void {
    if (this.elementsCleanup) {
      this.elementsCleanup();
    }
  }

  async submit(): Promise<void> {
    if (!this.clientSecret || !this.elements) {
      this.errorMessage.set('Payment form not ready. Please refresh and try again.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    try {
      const submitResult = await this.elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message || 'Payment form is invalid.');
      }

      await this.paymentService.confirmWithPaymentElement(this.clientSecret, this.elements);
      this.router.navigate(['/book/confirmation']);
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Payment failed. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}


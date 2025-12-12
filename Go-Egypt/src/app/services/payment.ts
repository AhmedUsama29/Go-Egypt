import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private publishableKey = 'pk_test_51SdQQQAJQFi5JqSjLQKvYgPM5z63naK4KrcQfyHwcz9id3ivV9Nq7PQOaFLC4etOEVawOdaHnsXYj5VXsKaPQUDn003wnnk1DI';
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(this.publishableKey);
  }

  async getStripe(): Promise<Stripe> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');
    return stripe;
  }

  async createPaymentElement(clientSecret: string): Promise<{ elements: StripeElements; paymentElement: StripePaymentElement; }> {
    const stripe = await this.getStripe();
    const elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment');
    return { elements, paymentElement };
  }

  async confirmWithPaymentElement(clientSecret: string, elements: StripeElements): Promise<void> {
    const stripe = await this.getStripe();
    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.origin + '/book/confirmation'
      },
      redirect: 'if_required'
    });

    if (result.error) {
      throw new Error(result.error.message || 'Payment confirmation failed');
    }
  }
}


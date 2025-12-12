// infrastructure/Persistence/ExternalServices/StripePaymentGateway.cs
using Microsoft.Extensions.Configuration;
using ServicesAbstraction;
using Shared.BookingDtos;
using Stripe;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// alias to avoid ambiguous 'Event' symbols
using StripeEvent = Stripe.Event;

namespace Persistence.ExternalServices
{
    public class StripePaymentGateway : IPaymentGateway
    {
        private readonly string _secretKey;
        private readonly string _webhookSecret;

        public StripePaymentGateway(IConfiguration configuration)
        {
            _secretKey = configuration["Stripe:SecretKey"] ?? throw new ArgumentNullException("Stripe:SecretKey");
            _webhookSecret = configuration["Stripe:WebhookSecret"] ?? string.Empty;

            StripeConfiguration.ApiKey = _secretKey;
        }

        public async Task<PaymentIntentDto> CreatePaymentIntentAsync(decimal amount, int bookingId, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = currency,
                Metadata = new Dictionary<string, string>
                {
                    { "bookingId", bookingId.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            return new PaymentIntentDto
            {
                ClientSecret = intent.ClientSecret ?? string.Empty,
                PaymentIntentId = intent.Id ?? string.Empty,
                Amount = amount,
                Currency = currency
            };
        }

        public Task<PaymentWebhookDto> VerifyWebhookAsync(string payload, string signatureHeader)
        {
            try
            {
                var stripeEvent = string.IsNullOrEmpty(_webhookSecret)
                    ? EventUtility.ParseEvent(payload)
                    : EventUtility.ConstructEvent(payload, signatureHeader, _webhookSecret);

                return Task.FromResult(TranslateEventToDto(stripeEvent, payload));
            }
            catch (StripeException sex)
            {
                // Throw a readable exception so controller can log and return BadRequest with message
                throw new Exception($"Stripe verification failed: {sex.Message}", sex);
            }
        }


        private PaymentWebhookDto TranslateEventToDto(Stripe.Event stripeEvent, string rawPayload)
        {
            // Compare by event type string (stable across versions)
            var type = stripeEvent.Type ?? string.Empty;

            if (type == "payment_intent.succeeded")
            {
                var pi = stripeEvent.Data.Object as PaymentIntent;
                int bookingId = 0;
                if (pi?.Metadata != null && pi.Metadata.ContainsKey("bookingId"))
                    int.TryParse(pi.Metadata["bookingId"], out bookingId);

                return new PaymentWebhookDto
                {
                    BookingId = bookingId,
                    PaymentIntentId = pi?.Id ?? string.Empty,
                    Success = true,
                    RawPayload = rawPayload
                };
            }

            if (type == "payment_intent.payment_failed" || type == "payment_intent.canceled")
            {
                var pi = stripeEvent.Data.Object as PaymentIntent;
                int bookingId = 0;
                if (pi?.Metadata != null && pi.Metadata.ContainsKey("bookingId"))
                    int.TryParse(pi.Metadata["bookingId"], out bookingId);

                return new PaymentWebhookDto
                {
                    BookingId = bookingId,
                    PaymentIntentId = pi?.Id ?? string.Empty,
                    Success = false,
                    RawPayload = rawPayload
                };
            }

            return new PaymentWebhookDto
            {
                BookingId = 0,
                PaymentIntentId = string.Empty,
                Success = false,
                RawPayload = rawPayload
            };
        }

    }
}

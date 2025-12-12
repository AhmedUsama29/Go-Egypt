using Shared.BookingDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IPaymentGateway
    {
        Task<PaymentIntentDto> CreatePaymentIntentAsync(decimal amount, int bookingId, string currency = "usd");
        Task<PaymentWebhookDto> VerifyWebhookAsync(string payload, string signatureHeader);
    }
}


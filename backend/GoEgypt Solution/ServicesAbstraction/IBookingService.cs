using Shared.BookingDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IBookingService
    {
        Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request, string userId);
        Task<BookingResponse> GetBookingByIdAsync(int id);
        Task<List<BookingResponse>> GetUserBookingsAsync(string userId);
        Task HandlePaymentWebhookAsync(PaymentWebhookDto dto);
    }
}

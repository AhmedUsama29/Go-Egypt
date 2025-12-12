using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    // this dto used to return booking details response to front-end
    // NOTE:NEXT STEP AFTER CREATING A BOOKING IS TO PROCESS PAYMENT
    // after payment is done the response should includes booking reference and the payment client secret (if applicable).
    public class BookingResponse
    {
        public int Id { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty; // Pending, Confirmed, Cancelled
        public string? PaymentClientSecret { get; set; } // e.g. Stripe client secret
        public DateTime CreatedAt { get; set; }
    }
}

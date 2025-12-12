using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    /// Represents essential payment information extracted from a webhook event.
    /// Used internally to update booking status after payment completion.
    public class PaymentWebhookDto
    {
        public int BookingId { get; set; }
        public string PaymentIntentId { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string? RawPayload { get; set; } // optional, for debug/logging
    }
}

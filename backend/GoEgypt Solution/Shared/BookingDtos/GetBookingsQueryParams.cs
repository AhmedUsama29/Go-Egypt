using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    /// Represents filtering and pagination parameters
    /// when requesting a list of bookings.
    public class GetBookingsQueryParams
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? UserId { get; set; } // For filtering by user
        public string? Status { get; set; } // Pending, Confirmed, Cancelled
    }
}

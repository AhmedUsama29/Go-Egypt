using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    /// Used by admin APIs (or internal tools)
    /// to manually update a booking status.
    public class UpdateBookingStatusRequest
    {

            [Required]
            public int BookingId { get; set; }

            [Required]
            public string Status { get; set; } = string.Empty; // Confirmed, Cancelled, etc.
        }
}

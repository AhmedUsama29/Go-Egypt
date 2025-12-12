using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    // this dto used as a form by front-end to send a "Post" booking request to backend
    //The backend should validate and re-calculate the price for security.
    public class CreateBookingRequest
    {
        [Required]
        public int AttractionId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(0, 100)]
        public int Adults { get; set; } = 1;

        [Range(0, 100)]
        public int Children { get; set; } = 0;

        [Required]
        public decimal TotalPrice { get; set; } // frontend can calculate or backend re-check

        // optional - traveler details
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }
}


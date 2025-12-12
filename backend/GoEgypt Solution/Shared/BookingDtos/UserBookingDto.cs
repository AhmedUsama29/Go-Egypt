using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    public class UserBookingDto
    {
        public int Id { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AttractionName { get; set; } = string.Empty;
        public string AttractionLocation { get; set; } = string.Empty;
        public string AttractionImage { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }

    }
}

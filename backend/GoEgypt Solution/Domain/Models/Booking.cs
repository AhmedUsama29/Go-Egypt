using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    // the booking status is pending by default
    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }
    public class Booking
    {
        public int Id { get; set; }
        public string BookingReference { get; set; } = Guid.NewGuid().ToString("N").ToUpper();
        public int AttractionId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("AttractionId")]
        public Attraction? Attraction { get; set; } // navigation
        public string UserId { get; set; }  // Identity user id
    }
}

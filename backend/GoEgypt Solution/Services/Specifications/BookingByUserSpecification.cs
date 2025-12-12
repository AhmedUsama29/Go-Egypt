using Domain.Models;
using System;

namespace Services.Specifications
{
    public class BookingByUserSpecification : BaseSpecification<Booking>
    {
        public BookingByUserSpecification(string userId) : base(b => b.UserId == userId)
        {
        }
    }
}

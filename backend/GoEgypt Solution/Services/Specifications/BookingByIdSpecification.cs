using Domain.Models;
using System;
using System.Linq.Expressions;

namespace Services.Specifications
{
    public class BookingByIdSpecification : BaseSpecification<Booking>
    {
        public BookingByIdSpecification(int id) : base(b => b.Id == id)
        {
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public sealed class BookingNotFoundException(int id) : NotFoundException($"Booking with id {id} was not found.")
    {
    }
}


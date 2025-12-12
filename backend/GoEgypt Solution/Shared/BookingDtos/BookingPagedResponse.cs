using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.BookingDtos
{
    // Represents a paginated list of bookings,
    // typically returned in admin views or user history pages.
    public class BookingPagedResponse
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IEnumerable<BookingDto> Data { get; set; } = new List<BookingDto>();
    }
}

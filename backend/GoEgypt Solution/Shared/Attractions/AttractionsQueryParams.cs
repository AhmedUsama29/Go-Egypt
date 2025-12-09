using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Attractions
{
    public class AttractionsQueryParams
    {

        public string? Category { get; set; }
        public string? Location { get; set; }


        private const int _dafaultPageSize = 5;
        private const int _maxPageSize = 10;

        private int pageSize = _dafaultPageSize;

        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value > 0 && value < _maxPageSize ? value : _dafaultPageSize; }
        }

        public int PageIndex { get; set; } = 1;
    }
}

using System;

namespace Shared.Reviews
{
    public enum ReviewStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class ReviewQueryParams
    {
        private const int _defaultPageSize = 10;
        private const int _maxPageSize = 50;

        private int pageSize = _defaultPageSize;

        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value > 0 && value <= _maxPageSize ? value : _defaultPageSize; }
        }

        public int PageNumber { get; set; } = 1;
        
        // Filtering options
        public int? AttractionId { get; set; }
        public string? UserId { get; set; }
        public int? MinRating { get; set; }
        public int? MaxRating { get; set; }
        public ReviewStatus? Status { get; set; }
        
        // Sorting options
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
        
        // Date filtering
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        
        // Search functionality
        public string? SearchTerm { get; set; }
    }
}
using System;
using System.ComponentModel.DataAnnotations;

namespace Shared.Reviews
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        
        public int AttractionId { get; set; }
        
        public string UserId { get; set; }
        
        [Required]
        public string UserName { get; set; }
        
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        public string Comment { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        public ReviewStatus Status { get; set; }
        
        // Additional display properties
        public bool IsOwner { get; set; } // Indicates if current user owns this review
        public string TimeAgo { get; set; } // Human-readable time format
    }
}
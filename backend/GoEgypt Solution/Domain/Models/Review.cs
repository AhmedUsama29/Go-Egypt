using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public enum ReviewStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class Review
    {
        public int Id { get; set; }
        
        [Required]
        public int AttractionId { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        public string UserName { get; set; } // For display purposes in domain logic
        
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }
        
        [Required]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Comment must be between 10 and 1000 characters")]
        public string Comment { get; set; }
        
        [Required]
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        [Required]
        public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
        
        // Navigation Properties (Domain level - no dependency on Identity)
        public Attraction Attraction { get; set; }
    }
}
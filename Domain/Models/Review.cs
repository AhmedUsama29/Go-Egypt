using Domain.Models.Identity;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Review
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        public ApplicationUser User { get; set; }
        
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }
        
        [Required]
        [MaxLength(5000)]
        public string Content { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        public bool IsDeleted { get; set; }
    }
}
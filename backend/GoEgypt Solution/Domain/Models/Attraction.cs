using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Attraction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Overview { get; set; }
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public List<KeyFact> KeyFacts { get; set; }
        public string MainPhotoPath { get; set; }
        public string Category { get; set; }
        public List<string> Gallery { get; set; }
        
        // Review-related properties
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        
        // Domain Logic Methods
        public void UpdateRatingStatistics(IEnumerable<Review> approvedReviews)
        {
            var reviewsList = approvedReviews?.Where(r => r.Status == ReviewStatus.Approved).ToList() ?? new List<Review>();
            
            AverageRating = reviewsList.Any() 
                ? Math.Round(reviewsList.Average(r => r.Rating), 2) 
                : 0;
            
            ReviewCount = reviewsList.Count;
        }
        
        // Overload for direct values (used by service layer)
        public void UpdateRatingStatistics(double averageRating, int reviewCount)
        {
            AverageRating = Math.Round(averageRating, 2);
            ReviewCount = reviewCount;
        }
        
        public bool HasReviews => ReviewCount > 0;
        
        public string GetRatingDisplay()
        {
            return HasReviews ? $"{AverageRating:F1} ({ReviewCount} reviews)" : "No reviews yet";
        }
    }

    public class KeyFact
    {
        public string Headline { get; set; }
        public string Description { get; set; }
    }
}

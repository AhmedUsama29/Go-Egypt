using System.Collections.Generic;

namespace Shared.Reviews
{
    public class ReviewStatistics
    {
        public int AttractionId { get; set; }
        
        public double AverageRating { get; set; }
        
        public int TotalReviews { get; set; }
        
        public Dictionary<int, int> RatingDistribution { get; set; } = new Dictionary<int, int>
        {
            { 1, 0 },
            { 2, 0 },
            { 3, 0 },
            { 4, 0 },
            { 5, 0 }
        };
        
        // Additional useful statistics
        public int ApprovedReviews { get; set; }
        public int PendingReviews { get; set; }
        public int RejectedReviews { get; set; }
        
        // Percentage calculations
        public double GetRatingPercentage(int rating)
        {
            if (TotalReviews == 0) return 0;
            return RatingDistribution.ContainsKey(rating) 
                ? (double)RatingDistribution[rating] / TotalReviews * 100 
                : 0;
        }
        
        public string GetRatingDisplay()
        {
            return TotalReviews > 0 
                ? $"{AverageRating:F1} ({TotalReviews} reviews)" 
                : "No reviews yet";
        }
    }
}
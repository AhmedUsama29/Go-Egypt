using Shared;
using Shared.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IReviewService
    {
        // CRUD Operations
        Task<ReviewResponse> CreateReviewAsync(CreateReviewRequest request, string userId);
        Task<ReviewResponse> UpdateReviewAsync(int reviewId, UpdateReviewRequest request, string userId);
        Task<bool> DeleteReviewAsync(int reviewId, string userId);
        Task<ReviewResponse?> GetReviewByIdAsync(int reviewId);
        
        // Query Operations
        Task<PaginatedResponse<ReviewResponse>> GetReviewsByAttractionAsync(int attractionId, ReviewQueryParams queryParams);
        Task<PaginatedResponse<ReviewResponse>> GetReviewsByUserAsync(string userId, ReviewQueryParams queryParams);
        Task<PaginatedResponse<ReviewResponse>> GetAllReviewsAsync(ReviewQueryParams queryParams);
        
        // Statistics Operations
        Task<ReviewStatistics> GetReviewStatisticsAsync(int attractionId);
        Task<ReviewStatistics> GetOverallStatisticsAsync();
        
        // Validation Operations
        Task<bool> HasUserReviewedAttractionAsync(int attractionId, string userId);
        Task<bool> CanUserEditReviewAsync(int reviewId, string userId);
        
        // Admin Operations
        Task<ReviewResponse> ApproveReviewAsync(int reviewId);
        Task<ReviewResponse> RejectReviewAsync(int reviewId);
        Task<PaginatedResponse<ReviewResponse>> GetPendingReviewsAsync(ReviewQueryParams queryParams);
    }
}
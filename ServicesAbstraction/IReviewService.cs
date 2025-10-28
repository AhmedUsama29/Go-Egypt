using Shared.Review;

namespace ServicesAbstraction
{
    public interface IReviewService
    {
        Task<ReviewResponse> CreateReviewAsync(string userId, ReviewRequest request);
        Task<IEnumerable<ReviewResponse>> GetAllReviewsAsync(int page = 1, int pageSize = 10);
        Task<IEnumerable<ReviewResponse>> GetUserReviewsAsync(string userId, int page = 1, int pageSize = 10);
        Task<ReviewResponse> GetReviewByIdAsync(int reviewId);
        Task<ReviewResponse> UpdateReviewAsync(string userId, int reviewId, ReviewUpdateRequest request);
        Task<bool> DeleteReviewAsync(string userId, int reviewId);
    }
}
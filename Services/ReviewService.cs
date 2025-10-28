using Domain.Models;
using ServicesAbstraction;
using Shared.Review;

namespace Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<ReviewResponse> CreateReviewAsync(string userId, ReviewRequest request)
        {
            var review = new Review
            {
                UserId = userId,
                Rating = request.Rating,
                Title = request.Title,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow
            };

            var createdReview = await _reviewRepository.CreateAsync(review);
            var fullReview = await _reviewRepository.GetByIdAsync(createdReview.Id);
            
            return MapToResponse(fullReview);
        }

        public async Task<bool> DeleteReviewAsync(string userId, int reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null || review.UserId != userId)
                return false;

            return await _reviewRepository.DeleteAsync(reviewId);
        }

        public async Task<IEnumerable<ReviewResponse>> GetAllReviewsAsync(int page = 1, int pageSize = 10)
        {
            var reviews = await _reviewRepository.GetAllAsync(page, pageSize);
            return reviews.Select(MapToResponse);
        }

        public async Task<ReviewResponse> GetReviewByIdAsync(int reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            return review != null ? MapToResponse(review) : null;
        }

        public async Task<IEnumerable<ReviewResponse>> GetUserReviewsAsync(string userId, int page = 1, int pageSize = 10)
        {
            var reviews = await _reviewRepository.GetByUserIdAsync(userId, page, pageSize);
            return reviews.Select(MapToResponse);
        }

        public async Task<ReviewResponse> UpdateReviewAsync(string userId, int reviewId, ReviewUpdateRequest request)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null || review.UserId != userId)
                return null;

            review.Rating = request.Rating;
            review.Title = request.Title;
            review.Content = request.Content;
            review.UpdatedAt = DateTime.UtcNow;

            var updatedReview = await _reviewRepository.UpdateAsync(review);
            return MapToResponse(updatedReview);
        }

        private static ReviewResponse MapToResponse(Review review)
        {
            return new ReviewResponse
            {
                Id = review.Id,
                UserName = review.User?.DisplayName ?? "Unknown",
                UserNationality = review.User?.Nationality ?? "Unknown",
                Rating = review.Rating,
                Title = review.Title,
                Content = review.Content,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt
            };
        }
    }
}
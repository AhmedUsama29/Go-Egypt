using Domain.Contracts;
using Domain.Models;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServicesAbstraction;
using Shared;
using Shared.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReviewStatusDomain = Domain.Models.ReviewStatus;
using ReviewStatusDto = Shared.Reviews.ReviewStatus;

namespace Services
{
    public class ReviewService(IUnitOfWork _unitOfWork, UserManager<ApplicationUser> _userManager) : IReviewService
    {
        // CRUD Operations
        public async Task<ReviewResponse> CreateReviewAsync(CreateReviewRequest request, string userId)
        {
            // Validate attraction exists
            var attractionRepo = _unitOfWork.GetRepository<Attraction, int>();
            var attraction = await attractionRepo.GetByIdAppDbAsync(request.AttractionId) 
                              ?? throw new ArgumentException("Attraction not found");

            // Validate user exists
            var user = await _userManager.FindByIdAsync(userId) 
                       ?? throw new ArgumentException("User not found");

            // Check if user already reviewed this attraction
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var alreadyReviewed = await reviewRepo.GetAllAppDbAsync()
                .AnyAsync(r => r.AttractionId == request.AttractionId && r.UserId == userId);

            if (alreadyReviewed)
                throw new InvalidOperationException("User has already reviewed this attraction");

            var review = new Review
            {
                AttractionId = request.AttractionId,
                UserId = userId,
                UserName = string.IsNullOrWhiteSpace(user.DisplayName) ? (user.UserName ?? "Unknown") : user.DisplayName,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
                Status = ReviewStatusDomain.Pending,
                Attraction = attraction
            };

            reviewRepo.AddAppDb(review);
            await _unitOfWork.SaveChangesAppDb();

            return MapToResponse(review, currentUserId: userId);
        }

        public async Task<ReviewResponse> UpdateReviewAsync(int reviewId, UpdateReviewRequest request, string userId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId) ?? throw new ArgumentException("Review not found");

            if (review.UserId != userId)
                throw new UnauthorizedAccessException("You are not allowed to edit this review");

            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.UpdatedAt = DateTime.UtcNow;
            review.Status = ReviewStatusDomain.Pending;

            reviewRepo.UpdateAppDb(review);
            await _unitOfWork.SaveChangesAppDb();

            return MapToResponse(review, currentUserId: userId);
        }

        public async Task<bool> DeleteReviewAsync(int reviewId, string userId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId);
            if (review == null) return false;

            if (review.UserId != userId)
                throw new UnauthorizedAccessException("You are not allowed to delete this review");

            reviewRepo.DeleteAppDb(review);
            await _unitOfWork.SaveChangesAppDb();
            return true;
        }

        public async Task<ReviewResponse?> GetReviewByIdAsync(int reviewId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId);
            return review == null ? null : MapToResponse(review);
        }

        // Query Operations
        public async Task<PaginatedResponse<ReviewResponse>> GetReviewsByAttractionAsync(int attractionId, ReviewQueryParams queryParams)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync().Where(r => r.AttractionId == attractionId);

            // Default to Approved if no status provided for public listing
            if (!queryParams.Status.HasValue)
            {
                query = query.Where(r => r.Status == ReviewStatusDomain.Approved);
            }
            else
            {
                query = query.Where(r => r.Status == (ReviewStatusDomain)(int)queryParams.Status.Value);
            }

            query = ApplyCommonFilters(query, queryParams);
            query = ApplySorting(query, queryParams);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            return new PaginatedResponse<ReviewResponse>
            {
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize),
                Data = items.Select(r => MapToResponse(r)).ToList()
            };
        }

        public async Task<PaginatedResponse<ReviewResponse>> GetReviewsByUserAsync(string userId, ReviewQueryParams queryParams)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync().Where(r => r.UserId == userId);

            if (queryParams.Status.HasValue)
            {
                query = query.Where(r => r.Status == (ReviewStatusDomain)(int)queryParams.Status.Value);
            }

            query = ApplyCommonFilters(query, queryParams);
            query = ApplySorting(query, queryParams);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            return new PaginatedResponse<ReviewResponse>
            {
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize),
                Data = items.Select(r => MapToResponse(r, currentUserId: userId)).ToList()
            };
        }

        public async Task<PaginatedResponse<ReviewResponse>> GetAllReviewsAsync(ReviewQueryParams queryParams)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync();

            if (queryParams.Status.HasValue)
            {
                query = query.Where(r => r.Status == (ReviewStatusDomain)(int)queryParams.Status.Value);
            }

            query = ApplyCommonFilters(query, queryParams);
            query = ApplySorting(query, queryParams);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            return new PaginatedResponse<ReviewResponse>
            {
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize),
                Data = items.Select(r => MapToResponse(r)).ToList()
            };
        }

        // Statistics Operations
        public async Task<ReviewStatistics> GetReviewStatisticsAsync(int attractionId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync().Where(r => r.AttractionId == attractionId);

            var stats = await BuildStatisticsAsync(query);
            stats.AttractionId = attractionId;
            return stats;
        }

        public async Task<ReviewStatistics> GetOverallStatisticsAsync()
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync();
            var stats = await BuildStatisticsAsync(query);
            stats.AttractionId = 0; // Indicates overall
            return stats;
        }

        // Validation Operations
        public async Task<bool> HasUserReviewedAttractionAsync(int attractionId, string userId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            return await reviewRepo.GetAllAppDbAsync()
                                   .AnyAsync(r => r.AttractionId == attractionId && r.UserId == userId);
        }

        public async Task<bool> CanUserEditReviewAsync(int reviewId, string userId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId);
            return review != null && review.UserId == userId;
        }

        // Admin Operations
        public async Task<ReviewResponse> ApproveReviewAsync(int reviewId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId) ?? throw new ArgumentException("Review not found");
            review.Status = ReviewStatusDomain.Approved;
            review.UpdatedAt = DateTime.UtcNow;
            reviewRepo.UpdateAppDb(review);
            await _unitOfWork.SaveChangesAppDb();
            return MapToResponse(review);
        }

        public async Task<ReviewResponse> RejectReviewAsync(int reviewId)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var review = await reviewRepo.GetByIdAppDbAsync(reviewId) ?? throw new ArgumentException("Review not found");
            review.Status = ReviewStatusDomain.Rejected;
            review.UpdatedAt = DateTime.UtcNow;
            reviewRepo.UpdateAppDb(review);
            await _unitOfWork.SaveChangesAppDb();
            return MapToResponse(review);
        }

        public async Task<PaginatedResponse<ReviewResponse>> GetPendingReviewsAsync(ReviewQueryParams queryParams)
        {
            var reviewRepo = _unitOfWork.GetRepository<Review, int>();
            var query = reviewRepo.GetAllAppDbAsync().Where(r => r.Status == ReviewStatusDomain.Pending);

            query = ApplyCommonFilters(query, queryParams);
            query = ApplySorting(query, queryParams);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            return new PaginatedResponse<ReviewResponse>
            {
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize),
                Data = items.Select(r => MapToResponse(r)).ToList()
            };
        }

        // Helpers
        private static IQueryable<Review> ApplyCommonFilters(IQueryable<Review> query, ReviewQueryParams queryParams)
        {
            if (queryParams.AttractionId.HasValue)
                query = query.Where(r => r.AttractionId == queryParams.AttractionId.Value);

            if (queryParams.MinRating.HasValue)
                query = query.Where(r => r.Rating >= queryParams.MinRating.Value);

            if (queryParams.MaxRating.HasValue)
                query = query.Where(r => r.Rating <= queryParams.MaxRating.Value);

            if (!string.IsNullOrWhiteSpace(queryParams.UserId))
                query = query.Where(r => r.UserId == queryParams.UserId);

            if (queryParams.FromDate.HasValue)
                query = query.Where(r => r.CreatedAt >= queryParams.FromDate.Value);

            if (queryParams.ToDate.HasValue)
                query = query.Where(r => r.CreatedAt <= queryParams.ToDate.Value);

            if (!string.IsNullOrWhiteSpace(queryParams.SearchTerm))
            {
                var term = queryParams.SearchTerm.ToLower();
                query = query.Where(r => r.Comment.ToLower().Contains(term));
            }

            return query;
        }

        private static IQueryable<Review> ApplySorting(IQueryable<Review> query, ReviewQueryParams queryParams)
        {
            var sortBy = (queryParams.SortBy ?? "CreatedAt").ToLower();
            bool asc = !queryParams.SortDescending;

            return sortBy switch
            {
                "rating" => asc ? query.OrderBy(r => r.Rating) : query.OrderByDescending(r => r.Rating),
                "updatedat" => asc ? query.OrderBy(r => r.UpdatedAt) : query.OrderByDescending(r => r.UpdatedAt),
                _ => asc ? query.OrderBy(r => r.CreatedAt) : query.OrderByDescending(r => r.CreatedAt)
            };
        }

        private static ReviewResponse MapToResponse(Review review, string? currentUserId = null)
        {
            return new ReviewResponse
            {
                Id = review.Id,
                AttractionId = review.AttractionId,
                UserId = review.UserId,
                UserName = review.UserName ?? "Unknown",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt,
                Status = (ReviewStatusDto)(int)review.Status,
                IsOwner = currentUserId != null && review.UserId == currentUserId,
                TimeAgo = GetTimeAgo(review.UpdatedAt ?? review.CreatedAt)
            };
        }

        private static string GetTimeAgo(DateTime dt)
        {
            var span = DateTime.UtcNow - dt;
            if (span.TotalSeconds < 60) return "just now";
            if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes} min ago";
            if (span.TotalHours < 24) return $"{(int)span.TotalHours} hrs ago";
            if (span.TotalDays < 30) return $"{(int)span.TotalDays} days ago";
            if (span.TotalDays < 365) return $"{(int)(span.TotalDays / 30)} months ago";
            return $"{(int)(span.TotalDays / 365)} years ago";
        }

        private static async Task<ReviewStatistics> BuildStatisticsAsync(IQueryable<Review> query)
        {
            // Consider only approved reviews for average and distribution
            var approvedQuery = query.Where(r => r.Status == ReviewStatusDomain.Approved);
            var totalReviews = await query.CountAsync();
            var approvedCount = await approvedQuery.CountAsync();
            var pendingCount = await query.CountAsync(r => r.Status == ReviewStatusDomain.Pending);
            var rejectedCount = await query.CountAsync(r => r.Status == ReviewStatusDomain.Rejected);

            double averageRating = approvedCount > 0 ? await approvedQuery.AverageAsync(r => r.Rating) : 0;

            var distribution = new Dictionary<int, int> { {1,0}, {2,0}, {3,0}, {4,0}, {5,0} };
            var grouped = await approvedQuery.GroupBy(r => r.Rating)
                                             .Select(g => new { Rating = g.Key, Count = g.Count() })
                                             .ToListAsync();
            foreach (var g in grouped)
            {
                if (distribution.ContainsKey(g.Rating)) distribution[g.Rating] = g.Count;
            }

            return new ReviewStatistics
            {
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                RatingDistribution = distribution,
                ApprovedReviews = approvedCount,
                PendingReviews = pendingCount,
                RejectedReviews = rejectedCount
            };
        }
    }
}
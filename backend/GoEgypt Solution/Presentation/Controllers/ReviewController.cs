using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared;
using Shared.Reviews;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public ReviewController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("attraction/{attractionId}")]
        public async Task<ActionResult<PaginatedResponse<ReviewResponse>>> GetReviewsByAttraction(
            int attractionId, 
            [FromQuery] ReviewQueryParams queryParams)
        {
            try
            {
                var reviews = await _serviceManager.ReviewService.GetReviewsByAttractionAsync(attractionId, queryParams);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewResponse>> CreateReview([FromBody] CreateReviewRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var review = await _serviceManager.ReviewService.CreateReviewAsync(request, userId);
                return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the review" });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ReviewResponse>> UpdateReview(int id, [FromBody] UpdateReviewRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var review = await _serviceManager.ReviewService.UpdateReviewAsync(id, request, userId);
                return Ok(review);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the review" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var result = await _serviceManager.ReviewService.DeleteReviewAsync(id, userId);
                if (!result)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the review" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponse>> GetReviewById(int id)
        {
            try
            {
                var review = await _serviceManager.ReviewService.GetReviewByIdAsync(id);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the review" });
            }
        }

        [HttpGet("statistics/attraction/{attractionId}")]
        public async Task<ActionResult<ReviewStatistics>> GetReviewStatistics(int attractionId)
        {
            try
            {
                var statistics = await _serviceManager.ReviewService.GetReviewStatisticsAsync(attractionId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving review statistics" });
            }
        }

        [HttpGet("check-reviewed/{attractionId}")]
        [Authorize]
        public async Task<ActionResult<bool>> HasUserReviewedAttraction(int attractionId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var hasReviewed = await _serviceManager.ReviewService.HasUserReviewedAttractionAsync(attractionId, userId);
                return Ok(hasReviewed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking review status" });
            }
        }
    }
}
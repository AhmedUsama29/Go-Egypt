using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.Review;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public ReviewController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewResponse>> CreateReview(ReviewRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _serviceManager.ReviewService.CreateReviewAsync(userId, request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewResponse>>> GetAllReviews(int page = 1, int pageSize = 10)
        {
            var reviews = await _serviceManager.ReviewService.GetAllReviewsAsync(page, pageSize);
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponse>> GetReview(int id)
        {
            var review = await _serviceManager.ReviewService.GetReviewByIdAsync(id);
            if (review == null)
                return NotFound();
            
            return Ok(review);
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReviewResponse>>> GetUserReviews(int page = 1, int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reviews = await _serviceManager.ReviewService.GetUserReviewsAsync(userId, page, pageSize);
            return Ok(reviews);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ReviewResponse>> UpdateReview(int id, ReviewUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _serviceManager.ReviewService.UpdateReviewAsync(userId, id, request);
            
            if (result == null)
                return NotFound();
            
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _serviceManager.ReviewService.DeleteReviewAsync(userId, id);
            
            if (!result)
                return NotFound();
            
            return NoContent();
        }
    }
}
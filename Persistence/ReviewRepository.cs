using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Identity;
using ServicesAbstraction;

namespace Persistence
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly GoEgyptIdentityDbContext _context;

        public ReviewRepository(GoEgyptIdentityDbContext context)
        {
            _context = context;
        }

        public async Task<Review> CreateAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return false;
            
            review.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Reviews.AnyAsync(r => r.Id == id && !r.IsDeleted);
        }

        public async Task<IEnumerable<Review>> GetAllAsync(int page, int pageSize)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => !r.IsDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Review> GetByIdAsync(int id)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
        }

        public async Task<IEnumerable<Review>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.UserId == userId && !r.IsDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Review> UpdateAsync(Review review)
        {
            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();
            return review;
        }
    }
}
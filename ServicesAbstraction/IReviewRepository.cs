using Domain.Models;

namespace ServicesAbstraction
{
    public interface IReviewRepository
    {
        Task<Review> CreateAsync(Review review);
        Task<IEnumerable<Review>> GetAllAsync(int page, int pageSize);
        Task<IEnumerable<Review>> GetByUserIdAsync(string userId, int page, int pageSize);
        Task<Review> GetByIdAsync(int id);
        Task<Review> UpdateAsync(Review review);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
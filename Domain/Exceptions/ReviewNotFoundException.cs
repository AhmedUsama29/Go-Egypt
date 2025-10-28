namespace Domain.Exceptions
{
    public class ReviewNotFoundException : Exception
    {
        public ReviewNotFoundException(int reviewId) 
            : base($"Review with ID {reviewId} was not found.")
        {
        }
    }
}
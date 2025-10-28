namespace Domain.Exceptions
{
    public class UnauthorizedReviewAccessException : Exception
    {
        public UnauthorizedReviewAccessException() 
            : base("You are not authorized to access this review.")
        {
        }
    }
}
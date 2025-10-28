namespace Shared.Review
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserNationality { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
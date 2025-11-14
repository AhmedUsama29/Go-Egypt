# Design Document - Attraction Reviews System

## Overview

The Attraction Reviews System will allow users to add, view, edit, and manage reviews for tourist attractions. The system follows the existing Clean Architecture pattern with separate layers for Domain, Services, Persistence, and Presentation. It integrates with the current authentication system and extends the existing Attraction functionality.

## Architecture

The system will be built using the existing Clean Architecture pattern:

- **Domain Layer**: Review entities and business rules
- **Services Layer**: Business logic for review operations
- **Persistence Layer**: Database operations and Entity Framework configurations
- **Presentation Layer**: API controllers for review endpoints
- **Shared Layer**: DTOs and request/response models
- **Frontend**: Angular components and services for review UI

## Components and Interfaces

### Backend Components

#### 1. Domain Models

**Review Entity** (`Domain/Models/Review.cs`):
```csharp
public class Review
{
    public int Id { get; set; }
    public int AttractionId { get; set; }
    public string UserId { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ReviewStatus Status { get; set; } // Pending, Approved, Rejected
    
    // Navigation Properties
    public Attraction Attraction { get; set; }
    public ApplicationUser User { get; set; }
}

public enum ReviewStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}
```

#### 2. Shared DTOs

**Review DTOs** (`Shared/Reviews/`):
- `ReviewResponse.cs`: For displaying reviews
- `CreateReviewRequest.cs`: For creating new reviews
- `UpdateReviewRequest.cs`: For updating existing reviews
- `ReviewQueryParams.cs`: For filtering and pagination
- `ReviewStatistics.cs`: For attraction review statistics

#### 3. Service Interfaces

**IReviewService** (`ServicesAbstraction/IReviewService.cs`):
```csharp
public interface IReviewService
{
    Task<PaginatedResponse<ReviewResponse>> GetReviewsByAttractionAsync(int attractionId, ReviewQueryParams queryParams);
    Task<ReviewResponse> CreateReviewAsync(CreateReviewRequest request, string userId);
    Task<ReviewResponse> UpdateReviewAsync(int reviewId, UpdateReviewRequest request, string userId);
    Task DeleteReviewAsync(int reviewId, string userId);
    Task<ReviewStatistics> GetReviewStatisticsAsync(int attractionId);
    Task<bool> HasUserReviewedAttractionAsync(int attractionId, string userId);
}
```

#### 4. API Controllers

**ReviewController** (`Presentation/Controllers/ReviewController.cs`):
- GET `/api/Review/attraction/{attractionId}` - Get reviews for attraction
- POST `/api/Review` - Create new review
- PUT `/api/Review/{id}` - Update review
- DELETE `/api/Review/{id}` - Delete review
- GET `/api/Review/statistics/{attractionId}` - Get review statistics

### Frontend Components

#### 1. Angular Services

**ReviewService** (`src/app/services/review.service.ts`):
- Methods for CRUD operations on reviews
- Integration with backend API
- Error handling and loading states

#### 2. Angular Components

**Review Components**:
- `ReviewListComponent`: Display list of reviews with pagination
- `ReviewFormComponent`: Form for creating/editing reviews
- `ReviewStatsComponent`: Display review statistics and ratings
- `StarRatingComponent`: Reusable star rating component

## Data Models

### Database Schema

#### Reviews Table
```sql
CREATE TABLE Reviews (
    Id INT PRIMARY KEY IDENTITY(1,1),
    AttractionId INT NOT NULL,
    UserId NVARCHAR(450) NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    Status INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (AttractionId) REFERENCES Attractions(Id),
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id),
    UNIQUE (AttractionId, UserId) -- One review per user per attraction
);
```

#### Indexes
- Index on `AttractionId` for fast retrieval
- Index on `UserId` for user's reviews
- Index on `Status` for moderation queries

### Updated Attraction Model

The existing `Attraction` entity will be extended with:
```csharp
public class Attraction
{
    // Existing properties...
    
    // New properties for reviews
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}
```

## Error Handling

### Custom Exceptions
- `ReviewNotFoundException`: When review doesn't exist
- `DuplicateReviewException`: When user tries to review same attraction twice
- `UnauthorizedReviewAccessException`: When user tries to modify others' reviews

### Validation Rules
- Rating must be between 1-5
- Comment must be between 10-1000 characters
- User must be authenticated to create reviews
- User can only edit/delete their own reviews

## Testing Strategy

### Unit Tests
- **Domain Tests**: Review entity validation and business rules
- **Service Tests**: Review service methods with mocked dependencies
- **Controller Tests**: API endpoint behavior and authorization

### Integration Tests
- **Database Tests**: Entity Framework operations with in-memory database
- **API Tests**: End-to-end API testing with test database

### Frontend Tests
- **Component Tests**: Angular component behavior and rendering
- **Service Tests**: HTTP service calls and error handling
- **E2E Tests**: Complete user workflows for review functionality

## Security Considerations

### Authentication & Authorization
- All review operations require valid JWT token
- Users can only modify their own reviews
- Admin role required for review moderation

### Input Validation
- Server-side validation for all review data
- XSS prevention for review comments
- Rate limiting to prevent spam reviews

### Data Protection
- Soft delete for reviews (mark as deleted instead of removing)
- Audit trail for review modifications
- User privacy protection in review display

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried columns
- Pagination for large review lists
- Caching for review statistics

### Frontend Optimization
- Lazy loading for review components
- Virtual scrolling for large review lists
- Optimistic updates for better UX

## Integration Points

### Existing Systems
- **Authentication**: Uses existing JWT and Identity system
- **Attractions**: Extends current attraction functionality
- **Database**: Uses existing Entity Framework context

### External Dependencies
- No new external dependencies required
- Uses existing packages and frameworks

## Migration Strategy

### Database Migration
1. Create Reviews table with proper constraints
2. Add review-related columns to Attractions table
3. Create necessary indexes
4. Seed initial data if needed

### Deployment Strategy
1. Deploy backend changes first
2. Run database migrations
3. Deploy frontend changes
4. Test integration thoroughly

## Future Enhancements

### Phase 2 Features
- Review photos/images
- Helpful/unhelpful voting on reviews
- Review replies from attraction owners
- Advanced filtering and sorting options

### Phase 3 Features
- Review sentiment analysis
- Automated spam detection
- Review translation for multiple languages
- Integration with social media sharing
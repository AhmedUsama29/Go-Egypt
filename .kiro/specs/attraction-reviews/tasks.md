# Implementation Plan - Attraction Reviews System

## Backend Implementation

- [x] 1. Create Domain Models and Enums






  - Create Review entity with all required properties and relationships
  - Create ReviewStatus enum with Pending, Approved, Rejected values
  - Update Attraction entity to include Reviews navigation property and rating fields
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2. Create Shared DTOs and Request Models


  - [x] 2.1 Create ReviewResponse DTO for displaying reviews


    - Include Id, AttractionId, UserName, Rating, Comment, CreatedAt, UpdatedAt properties
    - Add proper data annotations for validation
    - _Requirements: 2.2_



  - [x] 2.2 Create CreateReviewRequest DTO for new reviews




    - Include AttractionId, Rating, Comment properties with validation attributes


    - Add range validation for Rating (1-5) and length validation for Comment
    - _Requirements: 1.2, 1.3_



  - [x] 2.3 Create UpdateReviewRequest DTO for editing reviews



    - Include Rating and Comment properties with same validations as create request


    - _Requirements: 3.2, 3.3_

  - [x] 2.4 Create ReviewQueryParams for filtering and pagination


    - Include pagination parameters, sorting options, and status filters
    - _Requirements: 2.5, 4.2_

  - [x] 2.5 Create ReviewStatistics DTO for attraction statistics


    - Include AverageRating, TotalReviews, and RatingDistribution properties
    - _Requirements: 5.1, 5.2_



- [ ] 3. Update Database Context and Configurations
  - [x] 3.1 Add Review DbSet to ApplicationDbContext


    - Configure Review entity with proper relationships and constraints

    - Set up foreign key relationships with Attraction and ApplicationUser

    - _Requirements: 1.3, 2.1_



  - [x] 3.2 Create Review entity configuration

    - Configure unique constraint for AttractionId + UserId combination


    - Set up proper indexes for performance optimization
    - Configure cascade delete behavior
    - _Requirements: 1.3, 3.1_







  - [ ] 3.3 Create and run database migration


    - Generate migration for Reviews table and updated Attractions table
    - Test migration on development database
    - _Requirements: 1.3, 5.1_





- [ ] 4. Implement Review Service Layer
  - [x] 4.1 Create IReviewService interface in ServicesAbstraction





    - Define methods for CRUD operations and statistics
    - Include proper async signatures and return types

    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

  - [-] 4.2 Implement ReviewService in Services layer



    - Implement GetReviewsByAttractionAsync with pagination and filtering
    - Add proper error handling and validation
    - _Requirements: 2.1, 2.5_


  - [ ] 4.3 Implement CreateReviewAsync method
    - Validate user authentication and duplicate review prevention
    - Update attraction average rating after creating review
    - _Requirements: 1.1, 1.3, 1.5_


  - [ ] 4.4 Implement UpdateReviewAsync method
    - Validate user ownership of review before allowing updates
    - Update attraction average rating after modification

    - _Requirements: 3.2, 3.3, 3.5_

  - [ ] 4.5 Implement DeleteReviewAsync method
    - Validate user ownership before allowing deletion
    - Update attraction average rating after deletion


    - _Requirements: 3.4, 3.5_

  - [x] 4.6 Implement GetReviewStatisticsAsync method

    - Calculate average rating and rating distribution
    - Optimize query performance for statistics calculation
    - _Requirements: 5.1, 5.2_


  - [ ] 4.7 Implement HasUserReviewedAttractionAsync method
    - Check if user has already reviewed specific attraction
    - Use for preventing duplicate reviews
    - _Requirements: 1.4_


- [ ] 5. Create Review API Controller
  - [ ] 5.1 Create ReviewController with proper routing and authorization
    - Set up base controller with API routing and authentication requirements

    - Inject IServiceManager dependency
    - _Requirements: 1.4, 3.5_

  - [x] 5.2 Implement GET endpoint for attraction reviews

    - Create endpoint to retrieve paginated reviews for specific attraction
    - Add query parameter support for filtering and sorting
    - _Requirements: 2.1, 2.5, 5.4_

  - [ ] 5.3 Implement POST endpoint for creating reviews
    - Create endpoint for authenticated users to submit new reviews
    - Add proper validation and error handling
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ] 5.4 Implement PUT endpoint for updating reviews
    - Create endpoint for users to edit their own reviews
    - Validate user ownership before allowing updates
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 5.5 Implement DELETE endpoint for removing reviews


    - Create endpoint for users to delete their own reviews
    - Validate user ownership before allowing deletion
    - _Requirements: 3.4, 3.5_

  - [ ] 5.6 Implement GET endpoint for review statistics
    - Create endpoint to retrieve review statistics for attractions
    - Return average rating and rating distribution data
    - _Requirements: 5.1, 5.2_

- [ ] 6. Update Existing Services and Controllers
  - [ ] 6.1 Update AttractionService to include review data
    - Modify GetAttractionByIdAsync to include review statistics
    - Update attraction DTOs to include average rating and review count
    - _Requirements: 2.3, 5.5_

  - [ ] 6.2 Update AttractionController endpoints
    - Modify attraction details endpoint to return review statistics
    - Update attraction card data to include rating information
    - _Requirements: 2.3, 5.5_

  - [ ] 6.3 Register ReviewService in dependency injection
    - Add ReviewService registration in Program.cs or startup configuration
    - Update IServiceManager to include IReviewService
    - _Requirements: 1.1, 2.1_

## Frontend Implementation

- [ ] 7. Create Review Angular Service
  - [ ] 7.1 Create ReviewService with HTTP client integration
    - Implement methods for all CRUD operations on reviews
    - Add proper error handling and loading state management
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 7.2 Create review interfaces and models
    - Define TypeScript interfaces matching backend DTOs
    - Create models for review requests and responses
    - _Requirements: 1.2, 2.2, 3.2_

  - [ ] 7.3 Implement service methods for review operations
    - Create methods for getting, creating, updating, and deleting reviews
    - Add method for fetching review statistics
    - _Requirements: 1.1, 2.1, 3.1, 5.1_

- [ ] 8. Create Star Rating Component
  - [ ] 8.1 Create reusable StarRatingComponent
    - Build component for displaying and selecting star ratings
    - Support both read-only and interactive modes
    - _Requirements: 1.2, 2.2, 5.1_

  - [ ] 8.2 Add star rating styling and animations
    - Create CSS for star display with hover effects
    - Add smooth transitions for rating selection
    - _Requirements: 5.1_

- [ ] 9. Create Review Form Component
  - [ ] 9.1 Create ReviewFormComponent for adding/editing reviews
    - Build reactive form with rating and comment fields
    - Add form validation matching backend requirements
    - _Requirements: 1.1, 1.2, 3.1, 3.2_

  - [ ] 9.2 Implement form submission and error handling
    - Handle form submission with loading states
    - Display validation errors and success messages
    - _Requirements: 1.3, 3.3_

  - [ ] 9.3 Add edit mode functionality to form
    - Support pre-filling form for editing existing reviews
    - Handle update operations with proper user validation
    - _Requirements: 3.1, 3.2_

- [ ] 10. Create Review List Component
  - [ ] 10.1 Create ReviewListComponent for displaying reviews
    - Build component to show paginated list of reviews
    - Include reviewer information, rating, and comment display
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ] 10.2 Add pagination and sorting functionality
    - Implement pagination controls for large review lists
    - Add sorting options for reviews (newest first, rating, etc.)
    - _Requirements: 2.5, 5.4_

  - [ ] 10.3 Add user action buttons for own reviews
    - Show edit/delete buttons only for user's own reviews
    - Implement confirmation dialogs for delete operations
    - _Requirements: 3.1, 3.4, 3.5_

- [ ] 11. Create Review Statistics Component
  - [ ] 11.1 Create ReviewStatsComponent for attraction statistics
    - Display average rating with star visualization
    - Show total review count and rating distribution
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 11.2 Add visual rating distribution chart
    - Create bar chart or progress bars for rating distribution
    - Make statistics visually appealing and informative
    - _Requirements: 5.2_

- [ ] 12. Integrate Reviews into Attraction Details Page
  - [ ] 12.1 Update AttractionDetailsComponent to include reviews
    - Add review statistics display to attraction header
    - Include review list and form components in page layout
    - _Requirements: 1.1, 2.1, 2.3_

  - [ ] 12.2 Add conditional rendering based on authentication
    - Show "Write Review" button only for logged-in users
    - Display login prompt for anonymous users
    - _Requirements: 1.4_

  - [ ] 12.3 Implement review submission workflow
    - Handle review form submission and page updates
    - Show success messages and refresh review list
    - _Requirements: 1.3, 1.5_

- [ ] 13. Update Attraction Cards with Review Data
  - [ ] 13.1 Update attraction card components to show ratings
    - Add average rating display to attraction cards
    - Show review count alongside rating information
    - _Requirements: 5.5_

  - [ ] 13.2 Update attraction service to fetch review data
    - Modify attraction API calls to include review statistics
    - Update attraction interfaces to include rating fields
    - _Requirements: 2.3, 5.5_

## Testing and Integration

- [ ] 14. Create Backend Unit Tests
  - [ ] 14.1 Write unit tests for Review domain model
    - Test entity validation and business rules
    - Test relationship configurations and constraints
    - _Requirements: 1.1, 1.3_

  - [ ] 14.2 Write unit tests for ReviewService
    - Test all service methods with various scenarios
    - Mock dependencies and test error handling
    - _Requirements: 1.1, 2.1, 3.1, 5.1_

  - [ ] 14.3 Write unit tests for ReviewController
    - Test API endpoints with different user scenarios
    - Test authorization and validation behavior
    - _Requirements: 1.4, 3.5, 4.1_

- [ ] 15. Create Frontend Unit Tests
  - [ ] 15.1 Write tests for ReviewService
    - Test HTTP service methods and error handling
    - Mock HTTP client and test response processing
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 15.2 Write tests for Review components
    - Test component rendering and user interactions
    - Test form validation and submission behavior
    - _Requirements: 1.2, 2.2, 3.2_

- [ ] 16. Integration Testing and Bug Fixes
  - [ ] 16.1 Test complete review workflow end-to-end
    - Test creating, viewing, editing, and deleting reviews
    - Verify proper authentication and authorization
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 16.2 Test review statistics and rating calculations
    - Verify average rating calculations are correct
    - Test rating distribution and statistics display
    - _Requirements: 5.1, 5.2_

  - [ ] 16.3 Fix any integration issues and optimize performance
    - Address any bugs found during testing
    - Optimize database queries and frontend performance
    - _Requirements: All requirements_
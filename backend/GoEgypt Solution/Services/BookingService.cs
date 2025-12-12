// Services/BookingService.cs
using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Services.Specifications;
using ServicesAbstraction;
using Shared.BookingDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentGateway _paymentGateway;

        public BookingService(IUnitOfWork unitOfWork, IPaymentGateway paymentGateway)
        {
            _unitOfWork = unitOfWork;
            _paymentGateway = paymentGateway;
        }

        public async Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request, string userId)
        {
            if (request is null)
            {
                throw new BadRequestException(new List<string> { "Booking payload is required." });
            }

            var validationErrors = ValidateRequest(request);
            if (validationErrors.Any())
            {
                throw new BadRequestException(validationErrors);
            }

            var attractionRepo = _unitOfWork.GetRepository<Attraction, int>();
            var attractionSpec = new AttractionsByCategoryAndLocationSpecification(request.AttractionId);
            var attraction = await attractionRepo.GetByIdAppDbAsync(attractionSpec)
                             ?? throw new AttractionNotFoundException(request.AttractionId);

            var calculatedTotal = CalculateTotalPrice(attraction, request);

            var booking = new Booking
            {
                AttractionId = request.AttractionId,
                UserId = userId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Adults = request.Adults,
                Children = request.Children,
                TotalPrice = calculatedTotal,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            var repo = _unitOfWork.GetRepository<Booking, int>();
            repo.AddAppDb(booking);
            await _unitOfWork.SaveChanges();

            var paymentIntent = await _paymentGateway.CreatePaymentIntentAsync(booking.TotalPrice, booking.Id);

            return new BookingResponse
            {
                Id = booking.Id,
                BookingReference = booking.BookingReference,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status.ToString(),
                PaymentClientSecret = paymentIntent.ClientSecret,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<BookingResponse> GetBookingByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Booking, int>();
            var spec = new BookingByIdSpecification(id);
            var entity = await repo.GetByIdAppDbAsync(spec) ?? throw new BookingNotFoundException(id);

            return new BookingResponse
            {
                Id = entity.Id,
                BookingReference = entity.BookingReference,
                TotalPrice = entity.TotalPrice,
                Status = entity.Status.ToString(),
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<List<UserBookingDto>> GetUserBookingsAsync(string userId) 
        {
            var repo = _unitOfWork.GetRepository<Booking, int>();

            var spec = new Services.Specifications.BookingByUserSpecification(userId);

            var bookings = await repo.GetAllAppDbAsync(spec);

            return bookings.Select(b => new UserBookingDto
            {
                Id = b.Id,
                BookingReference = b.BookingReference,
                TotalPrice = b.TotalPrice,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,

                AttractionName = b.Attraction?.Name ?? "Unknown",
                AttractionLocation = b.Attraction?.Location ?? "",
                AttractionImage = b.Attraction?.MainPhotoPath ?? "",
                StartDate = b.StartDate,
                Adults = b.Adults,
                Children = b.Children
            }).ToList();
        }

        public async Task HandlePaymentWebhookAsync(PaymentWebhookDto dto)
        {
            var repo = _unitOfWork.GetRepository<Booking, int>();
            var spec = new BookingByIdSpecification(dto.BookingId);
            var booking = await repo.GetByIdAppDbAsync(spec);

            if (booking == null)
            {
                return;
            }

            booking.Status = dto.Success ? BookingStatus.Confirmed : BookingStatus.Cancelled;
            repo.UpdateAppDb(booking);
            await _unitOfWork.SaveChanges();
        }

        private static List<string> ValidateRequest(CreateBookingRequest request)
        {
            var errors = new List<string>();

            if (request.StartDate.Date < DateTime.UtcNow.Date)
            {
                errors.Add("Start date cannot be in the past.");
            }

            if (request.EndDate.Date <= request.StartDate.Date)
            {
                errors.Add("End date must be after start date.");
            }

            if (request.Adults < 1 && request.Children < 1)
            {
                errors.Add("At least one traveler must be included in the booking.");
            }

            if (request.Adults < 0 || request.Children < 0)
            {
                errors.Add("Traveler counts cannot be negative.");
            }

            return errors;
        }

        private static decimal CalculateTotalPrice(Attraction attraction, CreateBookingRequest request)
        {
            var baseAdultPrice = attraction.Price > 0 ? attraction.Price : 120m;
            const decimal childDiscountFactor = 0.5m;

            var durationDays = Math.Max(1, (int)Math.Ceiling((request.EndDate.Date - request.StartDate.Date).TotalDays));

            var categoryMultiplier = attraction.Category?.ToLower() switch
            {
                "historical" => 1.0m,
                "adventure" => 1.2m,
                "beach" => 1.1m,
                _ => 1.0m
            };

            var adultsPrice = request.Adults * baseAdultPrice;
            var childrenPrice = request.Children * baseAdultPrice * childDiscountFactor;

            var total = (adultsPrice + childrenPrice) * durationDays * categoryMultiplier;

            return Math.Round(total, 2, MidpointRounding.AwayFromZero);
        }
    }
}

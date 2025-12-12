// Services/BookingService.cs
using Domain.Contracts;
using Domain.Models;
using ServicesAbstraction;
using Shared.BookingDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Services.Specifications; // for BaseSpecification

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
            var booking = new Booking
            {
                AttractionId = request.AttractionId,
                UserId = userId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Adults = request.Adults,
                Children = request.Children,
                TotalPrice = request.TotalPrice,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            var repo = _unitOfWork.GetRepository<Booking, int>();
            repo.AddAppDb(booking);
            await _unitOfWork.SaveChanges();

            // create payment intent (abstracted)
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
            var spec = new Services.Specifications.BookingByIdSpecification(id);
            var entity = await repo.GetByIdAppDbAsync(spec);

            if (entity == null)
                throw new Exception($"Booking with id {id} not found.");

            return new BookingResponse
            {
                Id = entity.Id,
                BookingReference = entity.BookingReference,
                TotalPrice = entity.TotalPrice,
                Status = entity.Status.ToString(),
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<List<BookingResponse>> GetUserBookingsAsync(string userId)
        {
            var repo = _unitOfWork.GetRepository<Booking, int>();
            var spec = new Services.Specifications.BookingByUserSpecification(userId);
            var bookings = await repo.GetAllAppDbAsync(spec);

            return bookings.Select(b => new BookingResponse
            {
                Id = b.Id,
                BookingReference = b.BookingReference,
                TotalPrice = b.TotalPrice,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt
            }).ToList();
        }

        public async Task HandlePaymentWebhookAsync(PaymentWebhookDto dto)
        {
            var repo = _unitOfWork.GetRepository<Booking, int>();
            var spec = new BookingByIdSpecification(dto.BookingId);
            var booking = await repo.GetByIdAppDbAsync(spec);

            if (booking == null)
            {
                // not found — log or ignore
                return;
            }

            booking.Status = dto.Success ? BookingStatus.Confirmed : BookingStatus.Cancelled;
            repo.UpdateAppDb(booking);
            await _unitOfWork.SaveChanges();
        }
    }
}

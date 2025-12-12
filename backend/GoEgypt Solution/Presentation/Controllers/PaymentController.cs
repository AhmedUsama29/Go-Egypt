using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ServicesAbstraction;
using Shared.BookingDtos;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ILogger<PaymentController> _logger;
        private readonly IPaymentGateway _paymentGateway;
        private readonly IBookingService _bookingService;

        public PaymentController(ILogger<PaymentController> logger,
                                 IPaymentGateway paymentGateway,
                                 IBookingService bookingService)
        {
            _logger = logger;
            _paymentGateway = paymentGateway;
            _bookingService = bookingService;
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            Request.EnableBuffering();

            string payload;
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8, leaveOpen: true))
            {
                payload = await reader.ReadToEndAsync();
                Request.Body.Position = 0;
            }

            // --- DEBUG: print all headers ---
            foreach (var header in Request.Headers)
            {
                _logger.LogInformation("Header: {Key} = {Value}", header.Key, header.Value.ToString());
            }

            var signature = Request.Headers["Stripe-Signature"].FirstOrDefault();
            _logger.LogInformation("Stripe-Signature header (raw): {sig}", signature ?? "<MISSING>");

            try
            {
                var dto = await _paymentGateway.VerifyWebhookAsync(payload, signature);

                if (dto == null)
                {
                    _logger.LogWarning("VerifyWebhookAsync returned null DTO.");
                    return BadRequest("Invalid webhook payload.");
                }

                await _bookingService.HandlePaymentWebhookAsync(dto);
                _logger.LogInformation("Processed webhook for bookingId {bid}, success={s}", dto.BookingId, dto.Success);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Stripe webhook: {msg}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
        }


    }
}

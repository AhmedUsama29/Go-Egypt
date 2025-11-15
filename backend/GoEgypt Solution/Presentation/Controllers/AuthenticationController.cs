using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ServicesAbstraction;
using Shared.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController(IServiceManager _serviceManager,
                                           IOptions<EmailSenderOptions> _emailSettings) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<ActionResult<UserResponse>> Register(RegisterRequest request)
        {
            return Ok(await _serviceManager.AuthenticationService.RegisterAsync(request));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> Login(LoginRequest request)
        {
            return Ok(await _serviceManager.AuthenticationService.LoginAsync(request));
        }

        [HttpGet("emailExists")]
        public async Task<ActionResult<bool>> CheckEmail(string email)
        {
            return Ok(await _serviceManager.AuthenticationService.CheckEmailAsync(email));
        }

        [HttpGet("getUser")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> GetUser()
        {

            var email = User.FindFirstValue(ClaimTypes.Email);

            return Ok(await _serviceManager.AuthenticationService.GetUserByEmail(email));
        }

        [HttpPost("forgotPassword")]
        public async Task<ActionResult> ForgotPassword([FromBody]string email)
        {
            await _serviceManager.AuthenticationService.ForgotPasswordAsync(email);
            return Ok();
        }

        [HttpPost("resetPassword")]
        public async Task<ActionResult> ResetPassword(ResetPasswordRequest request)
        {

            await _serviceManager.AuthenticationService.ResetPasswordAsync(request);
            return Ok();
        }

    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpGet("details")]
        public async Task<ActionResult<ProfileResponse>> GetProfileDetails()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var response = await _serviceManager.ProfileService.GetUserProfileAsync(userId!);
            return Ok(response);

        }

        [HttpPut("edit")]
        public async Task<ActionResult<bool>> EditProfile(ProfileEditRequest request)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var res = await _serviceManager.ProfileService.EditProfileAsync(userId!, request);
            return Ok(res);
        }
    }
}

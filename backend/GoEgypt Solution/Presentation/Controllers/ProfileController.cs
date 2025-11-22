using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.Profile;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting; 

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController(IServiceManager _serviceManager,
                                 IWebHostEnvironment _webHostEnvironment) : ControllerBase 
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

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            string webRootPath = _webHostEnvironment.WebRootPath;
            if (string.IsNullOrEmpty(webRootPath))
            {
                return StatusCode(500, "Server error: WebRootPath not configured.");
            }

            var uploadsFolderPath = Path.Combine(webRootPath, "images", "profiles");

            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var publicUrl = $"/images/profiles/{uniqueFileName}";

            return Ok(new { newUrl = publicUrl });
        }

        [HttpGet("profile-picture")]
        public async Task<ActionResult<string>> GetProfilePicture()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var pictureUrl = await _serviceManager.ProfileService.GetProfilePicture(userId!);
            return Ok(pictureUrl);
        }
    }
}
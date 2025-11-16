using System;
using System.ComponentModel.DataAnnotations;

namespace Shared.Authentication
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Display name is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Display name must be between 3 and 50 characters.")]
        public string DisplayName { get; set; } = default!;

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "Username must be between 4 and 50 characters.")]
        public string UserName { get; set; } = default!;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = default!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = default!;

        [Required(ErrorMessage = "Date of birth is required.")]
        public DateOnly DateOfBirth { get; set; }

        [Required(ErrorMessage = "Nationality selection is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Nationality.")]
        public int NationalityId { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [AllowedValues("Male", "Female", "Other", ErrorMessage = "Invalid gender value.")]
        public string Gender { get; set; } = default!;
    }

}
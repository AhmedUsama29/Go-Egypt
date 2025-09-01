using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Identity
{
    public enum Gender
    {
        Male,
        Female,
        Other
    }
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Nationality { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Profile
{
    public class ProfileResponse
    {

        public string DisplayName { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Nationality { get; set; }
        public string ProfilePicture { get; set; }
        public string About { get; set; }
        public string Email { get; set; }
    }
}

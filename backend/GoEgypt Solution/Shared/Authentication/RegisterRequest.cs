using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Authentication
{
    public class RegisterRequest
    {
        public string DisplayName { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public DateOnly DateOfBirth { get; set; }
        public string Nationality { get; set; }
        public string Gender { get; set; }

    }
}

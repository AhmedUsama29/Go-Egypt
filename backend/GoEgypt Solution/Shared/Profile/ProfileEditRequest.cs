using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Profile
{
    public class ProfileEditRequest
    {
        public string DisplayName { get; set; }
        public string About { get; set; }
        public string PhotoLocation { get; set; }
    }
}

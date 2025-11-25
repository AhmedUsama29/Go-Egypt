using Shared.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IProfileService
    {
        public Task<ProfileResponse> GetUserProfileAsync(string userId);

        public Task<Boolean> EditProfileAsync(string userId, ProfileEditRequest profileEditRequest);

        public Task<string> GetProfilePicture(string userId);
    }
}

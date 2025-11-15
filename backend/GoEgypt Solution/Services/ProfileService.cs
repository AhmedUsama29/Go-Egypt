using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using ServicesAbstraction;
using Shared.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ProfileService(UserManager<ApplicationUser> _userManager,
                                IUnitOfWork _unitOfWork) : IProfileService
    {
        public async Task<bool> EditProfileAsync(string userId,ProfileEditRequest profileEditRequest)
        {

           var user = await _userManager.FindByIdAsync(userId)
                ?? throw new UserNotFoundException(userId);

            user.DisplayName = profileEditRequest.DisplayName;
            user.About = profileEditRequest.About;
            user.ProfilePicture = profileEditRequest.PhotoLocation;

            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }

        public async Task<ProfileResponse> GetUserProfileAsync(string userId)
        {


            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new UserNotFoundException(userId);

            var NatRepo = _unitOfWork.GetRepository<Nationality, int>();

            var natName = await NatRepo.GetByIdAsync(user.NationalityId);

            var profileResponse = new ProfileResponse()
            {
                DisplayName = user.DisplayName,
                About = user.About,
                DateOfBirth = user.DateOfBirth,
                Email = user.Email!,
                Gender = user.Gender.ToString(),
                Nationality = natName!.Name,
                ProfilePicture = user.ProfilePicture
            };

            return profileResponse;

        }
    }
}

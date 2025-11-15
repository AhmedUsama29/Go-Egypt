using Domain.Exceptions;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ServicesAbstraction;
using Shared.Authentication;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LoginRequest = Shared.Authentication.LoginRequest;
using RegisterRequest = Shared.Authentication.RegisterRequest;
using ResetPasswordRequest = Shared.Authentication.ResetPasswordRequest;

namespace Services
{
    public class AuthenticationService(UserManager<ApplicationUser> _userManager,
                                        IOptions<JWTOptions> _jwtOptions,
                                        IEmailSender _emailSender) : IAuthenticationService
    {

        public async Task<bool> CheckEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }

        public async Task<UserResponse> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email)
                ?? throw new UserNotFoundException(email);

            return new UserResponse
            {
                Email = user.Email!,
                DisplayName = user.DisplayName!,
                Token = await GenerateToken(user)
            };
        }

        public async Task<UserResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new UserNotFoundException(request.Email);

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (isPasswordValid)
                return new UserResponse
                {
                    Email = user.Email!,
                    DisplayName = user.DisplayName!,
                    Token = await GenerateToken(user)
                };

            throw new UnAuthorizedException();
        }

        public async Task<UserResponse> RegisterAsync(RegisterRequest request)
        {
            var user = new ApplicationUser()
            {
                Email = request.Email,
                UserName = request.UserName,
                NationalityId = request.NationalityId,
                DisplayName = request.DisplayName,
                DateOfBirth = request.DateOfBirth,
                Gender = Enum.TryParse<Gender>(request.Gender, true, out var gender) ? gender : throw new Exception("Wrong Gender Type")
            };

            var result = await _userManager.CreateAsync(user, request.Password);


            if (result.Succeeded) return new UserResponse()
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = await GenerateToken(user)
            };

            var Errors = result.Errors.Select(e => e.Description).ToList();

            throw new BadRequestException(Errors);
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email)
                     ?? throw new UserNotFoundException(email);
            
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var frontendUrl = "http://localhost:4200/reset-password";
            var callbackUrl = $"{frontendUrl}?email={user.Email}&token={encodedToken}";

            await _emailSender.SendEmailAsync(
                user.Email,
                "Reset Your Password - Go Egypt",
                $"Please reset your password by <a href='{callbackUrl}'>clicking here</a>."
            );
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                        ?? throw new UserNotFoundException(request.Email);

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(request.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    throw new BadRequestException(errors);
                }
            }
            catch (Exception)
            {
                var errors = new List<string> { "Invalid token." };
                throw new BadRequestException(errors);
            }
        }

        private async Task<string> GenerateToken(ApplicationUser user)
        {
            var jwtOptions = _jwtOptions.Value;

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id!),
            };

            string secretKey = jwtOptions.SecretKey;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtOptions.Issuer,
                audience: jwtOptions.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(jwtOptions.DurationInDays),
                signingCredentials: credentials
                );

            var tokenHandler = new JwtSecurityTokenHandler();

            return tokenHandler.WriteToken(token);
        }

    }
}

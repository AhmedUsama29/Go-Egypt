using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServicesAbstraction;
using Shared.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public static class ApplicationServiceRegisteration
    {

        public static IServiceCollection AddAplicationServices(this IServiceCollection services,
                                                                IConfiguration configuration)
        {
            services.AddScoped<IServiceManager, ServiceManagerWithFactoryDelegate>();

            services.AddScoped<IAuthenticationService, AuthenticationService>();

            services.AddScoped<ILookupServices, LookupServices>();

            services.AddScoped<IAttractionService, AttractionService>();

            services.AddScoped<IProfileService, ProfileService>();


            services.AddScoped<IBookingService, BookingService>();

            services.AddScoped<Func<IBookingService>>(provider => ()
            => provider.GetRequiredService<IBookingService>());


            services.AddScoped<Func<IProfileService>>(provider => ()
            => provider.GetRequiredService<IProfileService>());

            services.AddScoped<Func<IAuthenticationService>>(provider => ()
            => provider.GetRequiredService<IAuthenticationService>());

            services.AddScoped<Func<ILookupServices>>(provider => ()
            => provider.GetRequiredService<ILookupServices>());

            services.AddScoped<Func<IAttractionService>>(provider => ()
            => provider.GetRequiredService<IAttractionService>());

            services.Configure<JWTOptions>(configuration.GetSection("JWTOptions"));

            return services;
        }
    }
}

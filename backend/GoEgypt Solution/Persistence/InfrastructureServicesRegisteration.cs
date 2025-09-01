using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public static class InfrastructureServicesRegisteration
    {

        public static IServiceCollection AddInfrastructureRegistration(this IServiceCollection services, IConfiguration configurations)
        {

            services.AddDbContext<GoEgyptIdentityDbContext>(options =>
                            options.UseSqlServer(configurations.GetConnectionString("GoEgyptIdentityConnection")));


            services.RegisterIdentity();

            return services;
        }

        private static IServiceCollection RegisterIdentity(this IServiceCollection services)
        {

            services.AddIdentityCore<ApplicationUser>(config =>
            {
                config.User.RequireUniqueEmail = true;
            })
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<GoEgyptIdentityDbContext>();

            return services;
        }

    }
}

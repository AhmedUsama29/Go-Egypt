using GoEgypt.Factories;
using Microsoft.AspNetCore.Mvc;

namespace GoEgypt
{
    public static class Extentions
    {

        public static IServiceCollection AddWebApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddSwaggerServices();
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = ApiResponseFactory.GenerateApiValidationResponse;
            });


            return services;
        }

        private static void AddSwaggerServices(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }


    }
}

using GoEgypt.Middelwares;
using Persistence;
using Services;

namespace GoEgypt
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddInfrastructureRegistration(builder.Configuration);
            builder.Services.AddWebApplicationServices(builder.Configuration);
            builder.Services.AddAplicationServices(builder.Configuration);

            var app = builder.Build();

            await app.InitializeDbAsync();

            app.UseMiddleware<CustomExceptionHandlerMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAngularDev");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

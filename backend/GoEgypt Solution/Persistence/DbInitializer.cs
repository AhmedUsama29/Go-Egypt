using Domain.Contracts;
using Domain.Models;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence
{
    public class DbInitializer(GoEgyptIdentityDbContext _dbContext, GoEgyptDbContext _appDbContext) : IDbInitializer
    {
        public async Task InitializeIdentityAsync()
        {
            try
            {

                if (!_dbContext.Set<Nationality>().Any())
                {

                    var baseDirectory = AppContext.BaseDirectory;

                    var filePath = Path.Combine(baseDirectory, "SeedData", "nat.json");

                    if (!File.Exists(filePath))
                    {
                        Console.WriteLine($"ERROR: Seed data file not found at {filePath}");
                        throw new FileNotFoundException("Seed data file not found.", filePath);
                    }

                    var data = await File.ReadAllTextAsync(filePath);

                    var nationalities = JsonSerializer.Deserialize<List<Nationality>>(data);

                    if (nationalities is not null && nationalities.Any())
                    {
                        _dbContext.Set<Nationality>().AddRange(nationalities);
                        await _dbContext.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public async Task InitializeAppDbAsync()
        {
            try
            {
                if (!_appDbContext.Set<Attraction>().Any())
                {
                    var baseDirectory = AppContext.BaseDirectory;

                    var filePath = Path.Combine(baseDirectory, "SeedData", "attractions.json");

                    if (!File.Exists(filePath))
                    {
                        Console.WriteLine($"ERROR: Seed data file not found at {filePath}");
                        throw new FileNotFoundException("Seed data file not found.", filePath);
                    }

                    var data = await File.ReadAllTextAsync(filePath);

                    var attractions = JsonSerializer.Deserialize<List<Attraction>>(data);

                    if (attractions is not null && attractions.Any())
                    {
                        _appDbContext.Set<Attraction>().AddRange(attractions);
                        await _appDbContext.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

    }
}

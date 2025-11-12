using Domain.Contracts;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Persistence.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence
{
    public class DbInitializer(GoEgyptIdentityDbContext _dbContext) : IDbInitializer
    {
        public async Task InitializeIdentityAsync()
        {
            try
            {

                if (!_dbContext.Set<Nationality>().Any())
                {
                    
                    var data = await File.ReadAllTextAsync(@"..\infrastructure\Persistence\SeedData\nat.json");

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
    }
}

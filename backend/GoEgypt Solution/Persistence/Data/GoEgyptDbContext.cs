using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Data
{
    public class GoEgyptDbContext(DbContextOptions<GoEgyptDbContext> options) : DbContext(options)
    {

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(GoEgyptDbContext).Assembly);

        }

        public DbSet<Attraction> Attractions { get; set; }
        public DbSet<Review> Reviews { get; set; }

    }
}

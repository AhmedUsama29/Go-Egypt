using Domain.Models;
using Domain.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Identity
{
    public class GoEgyptIdentityDbContext(DbContextOptions<GoEgyptIdentityDbContext> options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<IdentityRole>().ToTable("Roles");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");

            builder.Entity<ApplicationUser>().Property(T => T.Gender)
                .HasConversion<string>()
                .HasColumnType("varchar(6)");

            builder.Entity<ApplicationUser>().Property(T => T.DateOfBirth)
                .IsRequired()
                .HasColumnType("date");

            builder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Rating).IsRequired();
                entity.Property(r => r.Title).IsRequired().HasMaxLength(200);
                entity.Property(r => r.Content).IsRequired().HasMaxLength(5000);
                entity.Property(r => r.CreatedAt).IsRequired();
                entity.Property(r => r.IsDeleted).HasDefaultValue(false);
                
                entity.HasOne(r => r.User)
                      .WithMany()
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(r => r.UserId);
                entity.HasIndex(r => r.CreatedAt);
                entity.HasIndex(r => r.IsDeleted);
            });
        }
    }
}

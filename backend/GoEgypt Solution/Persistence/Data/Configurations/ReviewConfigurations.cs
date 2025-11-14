using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Data.Configurations
{
    public class ReviewConfigurations : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            // Primary Key
            builder.HasKey(r => r.Id);

            // Properties Configuration
            builder.Property(r => r.UserId)
                .IsRequired()
                .HasMaxLength(450); // Standard ASP.NET Identity User ID length

            builder.Property(r => r.UserName)
                .HasMaxLength(256); // Standard username length

            builder.Property(r => r.Rating)
                .IsRequired()
                .HasColumnType("int");

            builder.Property(r => r.Comment)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(r => r.CreatedAt)
                .IsRequired()
                .HasColumnType("datetime2");

            builder.Property(r => r.UpdatedAt)
                .HasColumnType("datetime2");

            builder.Property(r => r.Status)
                .IsRequired()
                .HasConversion<string>(); // Store enum as string

            // Relationships
            builder.HasOne(r => r.Attraction)
                .WithMany(a => a.Reviews)
                .HasForeignKey(r => r.AttractionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for Performance
            builder.HasIndex(r => r.AttractionId)
                .HasDatabaseName("IX_Reviews_AttractionId");

            builder.HasIndex(r => r.UserId)
                .HasDatabaseName("IX_Reviews_UserId");

            builder.HasIndex(r => r.Status)
                .HasDatabaseName("IX_Reviews_Status");

            builder.HasIndex(r => r.CreatedAt)
                .HasDatabaseName("IX_Reviews_CreatedAt");

            // Unique Constraint: One review per user per attraction
            builder.HasIndex(r => new { r.AttractionId, r.UserId })
                .IsUnique()
                .HasDatabaseName("IX_Reviews_AttractionId_UserId_Unique");

            // Check Constraints
            builder.HasCheckConstraint("CK_Reviews_Rating", "[Rating] >= 1 AND [Rating] <= 5");
            builder.HasCheckConstraint("CK_Reviews_Comment_Length", "LEN([Comment]) >= 10");
        }
    }
}
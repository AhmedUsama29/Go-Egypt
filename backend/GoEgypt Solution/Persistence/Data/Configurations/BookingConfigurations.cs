using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Data.Configurations
{
    public  class BookingConfigurations:IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.BookingReference)
                .IsRequired();
            builder.Property(b => b.StartDate)
                .IsRequired();
            builder.Property(b => b.EndDate)
                .IsRequired();
            builder.Property(b => b.Adults)
                .IsRequired();
            builder.Property(b => b.Children)
                .IsRequired();
            builder.Property(b => b.TotalPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");
            builder.Property(b => b.Status)
                .IsRequired()
                .HasConversion<string>().HasMaxLength(50);
            builder.Property(b => b.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()");
            // Relationships
            builder.HasOne<Attraction>()
                .WithMany()
                .HasForeignKey(b => b.AttractionId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}

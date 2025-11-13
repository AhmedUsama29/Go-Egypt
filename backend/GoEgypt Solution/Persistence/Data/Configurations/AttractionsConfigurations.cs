using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence.Data.Configurations
{
    public class AttractionsConfigurations : IEntityTypeConfiguration<Attraction>
    {
        public void Configure(EntityTypeBuilder<Attraction> builder)
        {
            builder.HasKey(a => a.Id);
            builder.ToTable("Attractions");

            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(40);

            builder.Property(a => a.Location)
                .HasMaxLength(20);

            builder.Property(a => a.Overview)
                .IsRequired();

            builder.Property(a => a.MainPhotoPath)
                .IsRequired(true);

            builder.Property(a => a.Category)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(a => a.OpeningTime)
                .HasColumnType("time");

            builder.Property(a => a.ClosingTime)
                .HasColumnType("time");

            builder.OwnsMany(a => a.KeyFacts, keyFactBuilder =>
            {
                keyFactBuilder.ToTable("KeyFacts");
                keyFactBuilder.WithOwner().HasForeignKey("AttractionId");

                keyFactBuilder.Property(kf => kf.Headline)
                    .IsRequired()
                    .HasMaxLength(100);

                keyFactBuilder.Property(kf => kf.Description)
                    .IsRequired();
            });

            // --- Gallery (Primitive Collection as JSON) ---
            builder.Property(a => a.Gallery)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
                );
        }
    }
}

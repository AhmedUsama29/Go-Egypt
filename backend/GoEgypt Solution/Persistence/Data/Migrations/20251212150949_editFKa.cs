using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class editFKa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Attractions_AttractionId1",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_AttractionId1",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "AttractionId1",
                table: "Bookings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AttractionId1",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AttractionId1",
                table: "Bookings",
                column: "AttractionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Attractions_AttractionId1",
                table: "Bookings",
                column: "AttractionId1",
                principalTable: "Attractions",
                principalColumn: "Id");
        }
    }
}

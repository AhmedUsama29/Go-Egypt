using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Identity.Migrations
{
    /// <inheritdoc />
    public partial class editsonpics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "/images/profile/user.png",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "assets/user.png");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProfilePicture",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "assets/user.png",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "/images/profile/user.png");
        }
    }
}

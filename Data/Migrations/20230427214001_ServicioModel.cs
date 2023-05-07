using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ezpeleta2023.Data.Migrations
{
    public partial class ServicioModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Servicio",
                columns: table => new
                {
                    ServicioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false),
                    SubCategoriaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servicio", x => x.ServicioID);
                    table.ForeignKey(
                        name: "FK_Servicio_SubCategorias_SubCategoriaID",
                        column: x => x.SubCategoriaID,
                        principalTable: "SubCategorias",
                        principalColumn: "SubCategoriaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Servicio_SubCategoriaID",
                table: "Servicio",
                column: "SubCategoriaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Servicio");
        }
    }
}

using Ezpeleta2023.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ezpeleta2023.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // CONTEXTOS
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<SubCategoria> SubCategorias { get; set; }
    public DbSet<Servicios> Servicios { get; set; }
}

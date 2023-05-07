using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2023.Models
{
  public class SubCategoria
  {
    [Key]
    public int SubCategoriaID { get; set; }
    public string? Descripcion { get; set; }
    public bool Eliminado { get; set; }

    public int CategoriaID { get; set; }
    public virtual Categoria? Categoria { get; set; }

    public ICollection<Servicios>? Servicios { get; set; }
  }
}
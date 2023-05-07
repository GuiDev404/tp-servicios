using System.ComponentModel.DataAnnotations;

namespace Ezpeleta2023.Models
{
  public class Servicios
  {
    [Key]
    public int ServiciosID { get; set; }
    public string? Descripcion { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public bool Eliminado { get; set; }

    public int SubCategoriaID { get; set; }
    public virtual SubCategoria? SubCategoria { get; set; }
  }
}
namespace Ezpeleta2023.ViewModel
{
  public class ServiciosViewModel
  {
    public int ServiciosID { get; set; }
    public string? Descripcion { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public bool Eliminado { get; set; }

    public int CategoriaID { get; set; }
    public string? CategoriaDescripcion { get; set; }
    
    public int SubCategoriaID { get; set; }
    public string? SubCategoriaDescripcion { get; set; }
    public bool SubCategoriaEliminado { get; set; }
  }
}
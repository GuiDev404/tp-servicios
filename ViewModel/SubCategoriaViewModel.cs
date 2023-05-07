namespace Ezpeleta2023.ViewModel
{
  public class SubCategoriaViewModel
  {
    public int SubCategoriaID { get; set; }
    public string? Descripcion { get; set; }
    public bool Eliminado { get; set; }
    
    public int CategoriaID { get; set; }
    public string? CategoriaDescripcion { get; set; }
    public bool CategoriaEliminado { get; set; }
  }
}
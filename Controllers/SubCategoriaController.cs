using Ezpeleta2023.Data;
using Ezpeleta2023.Models;
using Ezpeleta2023.Utils;
using Ezpeleta2023.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Ezpeleta2023.Controllers {
  [Authorize]
  public class SubCategoriaController: Controller {
    
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _contexto;

    public SubCategoriaController(ILogger<HomeController> logger,ApplicationDbContext contexto)
    {
       _logger = logger;
      _contexto = contexto;
    }


    public IActionResult Index()
    {
      List<Categoria> categorias = _contexto.Categorias.Where(c=> !c.Eliminado).ToList();

      ViewBag.CategoriaID = new SelectList(categorias, "CategoriaID", "Descripcion"); 

      return View();
    }

    public JsonResult GuardarSubCategoria(string descripcion, int id, int categoriaId)
    {
      Resultados resultado = Resultados.Requerido;

      // VALIDAR QUE LA DESCRIPCION NO SEA NULA O VACIA Y QUE SE HAYA SELECCIONADO UNA CATEGORIA 
      if (!string.IsNullOrEmpty(descripcion) && categoriaId != 0)
      {

        // SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA
        if (id == 0)
        {

          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y SI PERTENECE A LA MISMA CATEGORIA, EN ESTE CASO LE DECIMOS QUE SI ES IGUAL A NULL, ES DECIR NO EXISTE ENTONCES QUE LA CREE
          var subCategoriaOriginal = _contexto.SubCategorias
            .Where(c => c.Descripcion == descripcion.Trim().ToUpper() && c.CategoriaID == categoriaId)
            .FirstOrDefault();
            
          if (subCategoriaOriginal == null)
          {
            SubCategoria nuevaSubCategoria = new SubCategoria()
            {
              Descripcion = descripcion.Trim().ToUpper(),
              CategoriaID = categoriaId
            };
            _contexto.Add(nuevaSubCategoria);
            _contexto.SaveChanges();

            resultado = Resultados.Ok;
          } else {
            resultado = Resultados.Existente;
          } 


        }
        else
        {
          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
          var subCategoriaOriginal = _contexto.SubCategorias
            .Where(c => (c.Descripcion == descripcion && c.CategoriaID == categoriaId) && c.SubCategoriaID != id)
            .FirstOrDefault();

          if (subCategoriaOriginal == null)
          {

            SubCategoria? subCategoriaActualizar = _contexto.SubCategorias.Find(id);
            if (subCategoriaActualizar != null)
            {
              subCategoriaActualizar.Descripcion = descripcion.ToUpper();
              subCategoriaActualizar.CategoriaID = categoriaId;

              _contexto.SaveChanges();
              resultado = Resultados.Ok;
            } else {
              resultado = Resultados.NotFound;
            }

          } else {
            resultado = Resultados.Existente;
          }



        }

      }

      return Json(resultado);
    }

    public JsonResult BuscarSubCategorias(int subCategoriaID = 0)
    {
      List<SubCategoria> subcategorias = _contexto.SubCategorias
        .Include(c=> c.Categoria)
        // .OrderBy(c => c.Descripcion)
        .ToList();

      if (subCategoriaID > 0)
      {
        subcategorias = subcategorias
          .Where(c => c.SubCategoriaID == subCategoriaID)
          .ToList();
      }

      List<SubCategoriaViewModel> subCategoriaViews = new List<SubCategoriaViewModel>();
      
      foreach (var sub in subcategorias)
      {
        SubCategoriaViewModel viewModel = new SubCategoriaViewModel {
          SubCategoriaID = sub.SubCategoriaID,
          Descripcion = sub.Descripcion,
          Eliminado = sub.Eliminado,

          CategoriaID = sub.Categoria.CategoriaID,
          CategoriaDescripcion = sub.Categoria.Descripcion,
          CategoriaEliminado = sub.Categoria.Eliminado,
        };

        subCategoriaViews.Add(viewModel);
      }
      
      return Json(subCategoriaViews);
    }

    public async Task<JsonResult> EliminarSubCategoria (int id, bool valor){
      Resultados resultado = Resultados.NotFound;

      SubCategoria? subcategoria = await _contexto.SubCategorias.FindAsync(id);
      
      if (subcategoria != null)
      {
        if(subcategoria.Eliminado){
          subcategoria.Eliminado = false;
          _contexto.SaveChanges();
          resultado = Resultados.Ok;
        } else {
          // NO SE PUEDEN ELIMINAR LA SUBCATEGORIA SI ESTA EN SERVICIOS ACTIVOS
          int cantidadServicios = (from s in _contexto.Servicios where s.SubCategoriaID == id && s.Eliminado == false select s).Count();

          if(cantidadServicios == 0){
            subcategoria.Eliminado = true;
            _contexto.SaveChanges();
            resultado = Resultados.Ok;
          } else {
            resultado = Resultados.NoEliminadoExistenteOtraTabla;
          }
        }
      }

      return Json(resultado);
    } 
  }
}
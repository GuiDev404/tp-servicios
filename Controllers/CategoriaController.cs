
using Ezpeleta2023.Data;
using Ezpeleta2023.Models;
using Ezpeleta2023.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ezpeleta2023.Controllers
{
  [Authorize]
  public class CategoriaController : Controller
  {
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _contexto;

    public CategoriaController(ILogger<HomeController> logger, ApplicationDbContext contexto)
    {
      _logger = logger;
      _contexto = contexto;
    }

    public IActionResult Index()
    {
      return View();
    }



    public JsonResult GuardarCategoria(string descripcion, int id)
    {
      Resultados resultado = Resultados.Requerido;

      // VALIDAR QUE LA DESCRIPCION NO SEA NULA O VACIA
      if (!string.IsNullOrEmpty(descripcion)) {

        // SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA
        if (id == 0)
        {

          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION, EN ESTE CASO LE DECIMOS QUE SI ES IGUAL A NULL ES DECIR NO EXISTE ENTONCES LA CREE
          var categoriaOriginal = _contexto.Categorias
            .Where(c => c.Descripcion == descripcion)
            .FirstOrDefault();
            
          if (categoriaOriginal == null)
          {
            Categoria nuevaCategoria = new Categoria()
            {
              Descripcion = descripcion.ToUpper()
            };
            _contexto.Add(nuevaCategoria);
            _contexto.SaveChanges();

            resultado = Resultados.Ok;
          } else {
            resultado = Resultados.Existente;
          }


        }
        else
        {
          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
          var categoriaOriginal = _contexto.Categorias
            .Where(c => c.Descripcion == descripcion && c.CategoriaID != id)
            .FirstOrDefault();

          if (categoriaOriginal == null)
          {

            Categoria? categoriaActualizar = _contexto.Categorias.Find(id);
            if (categoriaActualizar != null)
            {
              categoriaActualizar.Descripcion = descripcion.ToUpper();

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


    public JsonResult BuscarCategorias(int categoriaID = 0)
    {
      List<Categoria> categorias = _contexto.Categorias.ToList();

      if (categoriaID > 0)
      {
        categorias = categorias.Where(c => c.CategoriaID == categoriaID).OrderBy(c => c.Descripcion).ToList();
      }

      return Json(categorias);
    }


    public JsonResult EliminarCategoria(int id, bool valor)
    {
      Resultados resultado = Resultados.NotFound;

      Categoria? categoria = _contexto.Categorias.Find(id);
      if (categoria != null)
      {
        if(categoria.Eliminado){
          categoria.Eliminado = false;
          _contexto.SaveChanges();
          resultado = Resultados.Ok;
        } else {
          // NO SE PUEDEN ELIMINAR LA CATEGORIA SI ESTA EN SUBCATEGORIAS ACTIVAS
          int cantidadSubcategorias = (from s in _contexto.SubCategorias where s.CategoriaID == id && s.Eliminado == false select s).Count();

          if(cantidadSubcategorias == 0){
            categoria.Eliminado = true;
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
using Ezpeleta2023.Data;
using Ezpeleta2023.Models;
using Ezpeleta2023.Utils;
using Ezpeleta2023.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Servicio.Controllers
{
  [Authorize]
  public class ServicioController : Controller
  {
    private readonly ILogger<ServicioController> _logger;
    private readonly ApplicationDbContext _contexto;

    public ServicioController(ILogger<ServicioController> logger, ApplicationDbContext contexto)
    {
      _logger = logger;
      _contexto = contexto;
    }

    public IActionResult Index()
    {
      List<SubCategoria> subcategorias = _contexto.SubCategorias.Where(c=> !c.Eliminado).ToList();

      ViewBag.SubCategoriaID = new SelectList(subcategorias, "SubCategoriaID", "Descripcion"); 
      return View();
    }

    public JsonResult GuardarServicio(int id, string descripcion, string direccion, string telefono, int subCategoriaId)
    {
      Resultados resultado = Resultados.Requerido;

      // VALIDAR QUE LOS CAMPOS NO SEAN NULOS O VACIOS Y QUE SE HAYA SELECCIONADO UNA SUBCATEGORIA 
      if (!string.IsNullOrEmpty(descripcion) && subCategoriaId != 0 && !string.IsNullOrEmpty(direccion) && !string.IsNullOrEmpty(telefono))
      {

        // SI ES 0 QUIERE DECIR QUE ESTA CREANDO
        if (id == 0)
        {

          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y SI PERTENECE A LA MISMA CATEGORIA, EN ESTE CASO LE DECIMOS QUE SI ES IGUAL A NULL, ES DECIR NO EXISTE ENTONCES QUE LA CREE
          var servicioOriginal = _contexto.Servicios
            .Where(c => c.Descripcion == descripcion.Trim().ToUpper() && c.SubCategoriaID == subCategoriaId)
            .FirstOrDefault();
            
          if (servicioOriginal == null)
          {
            Servicios nuevoServicio = new Servicios()
            {
              Descripcion = descripcion.Trim().ToUpper(),
              Direccion = direccion.Trim().ToUpper(),
              Telefono = telefono.Trim().ToUpper(),
              SubCategoriaID = subCategoriaId
            };

            _contexto.Add(nuevoServicio);
            _contexto.SaveChanges();

            resultado = Resultados.Ok;
          } else {
            resultado = Resultados.Existente;
          } 


        }
        else
        {
          //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
          var servicioOriginal = _contexto.Servicios
            .Where(c => (c.Descripcion == descripcion && c.SubCategoriaID == subCategoriaId) && c.ServiciosID != id)
            .FirstOrDefault();

          if (servicioOriginal == null)
          {

            Servicios? servicioActualizar = _contexto.Servicios.Find(id);
            if (servicioActualizar != null)
            {
              servicioActualizar.Descripcion = descripcion.Trim().ToUpper();
              servicioActualizar.Direccion = direccion.Trim().ToUpper();
              servicioActualizar.Telefono = telefono.Trim().ToUpper();
              servicioActualizar.SubCategoriaID = subCategoriaId;

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

    public JsonResult BuscarServicios(int servicioId = 0)
    {
      List<Servicios> servicios = _contexto.Servicios
        .Include(ser=> ser.SubCategoria)
        .Include(sub=> sub.SubCategoria.Categoria)
        .OrderBy(c => c.Descripcion)
        .ToList();

      if (servicioId > 0)
      {
        servicios = servicios
          .Where(c => c.ServiciosID == servicioId)
          .ToList();
      }

      List<ServiciosViewModel> serviciosParaVista = new List<ServiciosViewModel>();
      
      foreach (var servicio in servicios)
      {
        ServiciosViewModel viewModel = new ServiciosViewModel {
          ServiciosID = servicio.ServiciosID,
          Descripcion = servicio.Descripcion,
          Direccion = servicio.Direccion,
          Telefono = servicio.Telefono,
          Eliminado = servicio.Eliminado,
          SubCategoriaID = servicio.SubCategoria.SubCategoriaID,
          SubCategoriaDescripcion = servicio.SubCategoria.Descripcion,
          SubCategoriaEliminado = servicio.SubCategoria.Eliminado,
          CategoriaDescripcion = servicio.SubCategoria.Categoria.Descripcion
        };

        serviciosParaVista.Add(viewModel);
      }
      
      return Json(serviciosParaVista);
    }
   
    public JsonResult EliminarServicio(int id, bool valor)
    {
      Resultados resultado = Resultados.NotFound;

      Servicios? servicio = _contexto.Servicios.Find(id);
      if (servicio != null)
      {
        servicio.Eliminado = valor;

        resultado = Resultados.Ok;
        _contexto.SaveChanges();
      }

      return Json(resultado);
    }

  }
}
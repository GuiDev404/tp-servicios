$(document).ready(function() {
  $("#modalCategoria").on('hide.bs.modal', function(){
    limpiarFormulario()
  });
  
  $("#modalCategoria").on('show.bs.modal', function(){
    const tituloModal = document.getElementById('modalCategoriaTitulo')
    const id = $("#categoriaId").val();

    tituloModal.innerText = id === '0' ? 'Agregar categoria' : 'Actualizar categoria'
  });
  
  $('#formCategoria').validate({
    errorClass: 'text-danger small d-block mt-1',
    rules: {
      categoriaDescripcion: "required" 
    },
    messages: {
      categoriaDescripcion: "La descripción de la categoria es requerida. Ingrese una."
    },
  })
  
  // const inputBuscador = document.getElementById('buscador')
  // inputBuscador.addEventListener('input', filtrarPorBusqueda)
  
  const TIEMPO_DE_ESPERA = 700;
  setTimeout(function () {
    buscarCategorias()

    // const filtros = $('#filtros');
    // filtros.on("change", manejoDeFiltro);

    
  }, TIEMPO_DE_ESPERA)

})

const configDatatable = {
  lengthMenu: [5, 10, 25, 50],
  columnDefs: [
    { target: 1, searchable: false, orderable: false, width: 200 } 
  ],
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
    info: "Registros del _START_ al _END_ de _TOTAL_",
  },
}
let datatableCategoria = new DataTable('#tabla_categoria', configDatatable);


function limpiarFormulario() {

  $("#categoriaId").val(0)
  $("#categoriaDescripcion").val("")
  $("#categoriaDescripcion-error").text("")
}

// ------------ CRUD -------------
function guardarCategoria() {
  const id = Number($("#categoriaId").val())
  const descripcion = $("#categoriaDescripcion").val()

  const tituloAccion = $('.modal-title').text()

  if(!$('#formCategoria').valid()) return;


  $.ajax({
    url : '../../Categoria/GuardarCategoria',
    data : { descripcion: descripcion, id: id },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {

      if(resultado > 0){
        const mensajes = {
          '1': 'Complete los campos marcados como requeridos',
          '2': 'Ya existe una categoría con la misma descripción',
          '3': 'No se pudo encontrar la categoria'
        }

        const errorDeResumen = $("#errorResumen")
        const errorDescripcion = $("#errorDescripcion")
        
        if(resultado === 1 || resultado === 3){
          errorDeResumen.text(mensajes?.[resultado])  
          errorDeResumen.removeClass('d-none')

        } else {
          errorDescripcion.text(mensajes?.[resultado] ?? '')
        }
        
        setTimeout(()=> {
          errorDescripcion.text('')
          errorDeResumen.text('')  
          errorDeResumen.addClass('d-none')
        }, 3000)
        return;
      }

      buscarCategorias();
      $("#modalCategoria").modal('hide');

      toast({ 
        type: 'success',
        title: tituloAccion,
        message: 'Categoria guardada correctamente.'
      })
    },

    error : function(_error) {
      $("#modalCategoria").modal('hide');

      toast({ 
        type: 'error',
        title: tituloAccion,
        message: 'Lo sentimos, algo salio mal.'
      })
    },
  });
}

function buscarCategorias (){
  const cantidadCategorias = $('#cantidad_categorias');

  $.ajax({
    url : '../../Categoria/BuscarCategorias',
    data : {  },
    type : 'GET',
    dataType : 'json',
    success : function(categorias) {
      const cantidadCategoriasTxt = categorias && categorias.length 
        ? `${categorias.length} categorias`
        : 'No hay categorias';

      cantidadCategorias.text(cantidadCategoriasTxt);

      $('#tabla_categoria').DataTable().destroy();
      // if ($.fn.DataTable.isDataTable($('#tabla_categoria'))) {
      //     $('#tabla_categoria').DataTable().destroy();
      // }

      $("#tBody").empty();

      categorias.forEach(categoria=> {

        const acciones = categoria.eliminado
          ? `
            <td class="text-end">
              <button type="button" class="btn btn-success btn-sm" onclick="eliminarCategoria(${categoria.categoriaID}, false)">
                Habilitar
              </button>
            </td>
          `
          : `
            <td class="text-end">
              <button type="button" class="btn btn-primary btn-sm" onclick="buscarCategoria(${categoria.categoriaID})">
                Editar
              </button>
              <button type="button" class="btn btn-danger btn-sm" onclick="eliminarCategoria(${categoria.categoriaID}, true)">
                Deshabilitar
              </button>
            </td>
          `

        $("#tBody").append(`
          <tr>
            <td class="${categoria.eliminado ? 'text-decoration-line-through' : ''}">
              ${categoria.descripcion}
            </td>
            ${acciones}
          </tr>
        `);

        
      })

      $('#tabla_categoria').DataTable(configDatatable);


      // const rows = categorias.map(categoria=> {
        
      //   const acciones = categoria.eliminado
      //     ? `
      //         <button type="button" class="btn btn-success btn-sm" onclick="eliminarCategoria(${categoria.categoriaID}, false)">
      //           Habilitar
      //         </button>
      //       `
      //     : `
      //         <button type="button" class="btn btn-primary btn-sm" onclick="buscarCategoria(${categoria.categoriaID})">
      //           Editar
      //         </button>
      //         <button type="button" class="btn btn-danger btn-sm" onclick="eliminarCategoria(${categoria.categoriaID}, true)">
      //           Deshabilitar
      //         </button>
      //     `

      //     return {
      //       'Descripcion': categoria.descripcion,
      //       'Acciones': acciones,
      //     }
      // });
      
  
 
    },

    error : function(error) {
      toast({ 
        type: 'error',
        title: 'Busqueda de categorias',
        message: 'Lo sentimos. No se pudo recuperar las categorias.'
      })

      $('#tBody').html('')
      $('#tFooter tr td:first-child').text('No se encontraron categorias')
      cantidadCategorias.html('No hay categorias');
    },

  });
}

function buscarCategoria(categoriaId) {
  $.ajax({
    url : '../../Categoria/BuscarCategorias',
    data : { categoriaID: categoriaId },
    type : 'GET',
    dataType : 'json',
    success : function(categorias) {

      if (categorias.length == 1){
        const categoria = categorias[0];
        $("#categoriaDescripcion").val(categoria.descripcion);
        $("#categoriaId").val(categoria.categoriaID);

        $("#modalCategoria").modal("show");
      }

    },
    error: function(xhr, status) {
      toast({ 
        type: 'error',
        title: 'Buscar categoria',
        message: 'Lo sentimos. No se pudo recuper la categoria.'
      })
    },
  });
}

function eliminarCategoria(id, valor) {

  $.ajax({
    url : '../../Categoria/EliminarCategoria',
    data : { id, valor },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {

      if(!resultado){
        buscarCategorias()
        return;
      }

      const mensajes = {
        '3': 'No se pudo eliminar la categoria.',
        '4': 'No se puede eliminar la categoria porque existe en una subcategoria. Elimine primero esta.'
      }
      
      toast({
        type: 'error',
        title: 'Eliminar categoria', 
        message: mensajes?.[resultado] 
      })
    },

    error : function(_error) {
      toast({ 
        type: 'error',
        title: 'Eliminar categoria',
        message: 'Lo sentimos no se pudo eliminar la categoria.'
      })
    },
  });
}
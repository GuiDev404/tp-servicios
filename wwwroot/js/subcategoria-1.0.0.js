

$(document).ready(function() {
  $("#modalSubcategoria").on('hide.bs.modal', function(){
    limpiarFormulario()
  });
  
  $("#modalSubcategoria").on('show.bs.modal', function(){
    const tituloModal = document.getElementById('modalSubcategoriaTitulo')
    const id = $("#subCategoriaId").val();

    tituloModal.innerText = id === '0' ? 'Agregar subcategoria' : 'Actualizar subcategoria'
  });
  
  $('#formModal').validate({
    errorClass: 'text-danger small d-block mt-1',
    rules: {
      subcategoriaDescripcion: "required", 
      CategoriaID: {
        required: true,
        selected: true
      },
    },
    messages: {
      subcategoriaDescripcion: "La descripción para la subcategoria es requerida. Ingrese una.",
      CategoriaID: {
        required: "La categoria para la subcategoria es requerida. Seleccione una.",
        selected: 'Seleccione una categoria'
      }
    }
  })
  
  // const inputBuscador = document.getElementById('buscador')
  // inputBuscador.addEventListener('input', filtrarPorBusqueda)
  
  const TIEMPO_DE_ESPERA = 700;
  setTimeout(function () {
    buscarSubCategorias()
    
    // const filtros = $('#filtros');
    // filtros.on("change", manejoDeFiltro);
  }, TIEMPO_DE_ESPERA)

})

const configDatatable = {
  lengthMenu: [5, 10, 25, 50],
  columnDefs: [
    { target: 2, searchable: false, orderable: false, width: 200 } 
  ],
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
    info: "Registros del _START_ al _END_ de _TOTAL_",
  },
}

new DataTable('#tabla_subcategoria', configDatatable);



function limpiarFormulario() {
  $("#subCategoriaId").val(0)
  $("#subcategoriaDescripcion").val("")
  $("#subcategoriaDescripcion-error").text("")
  
  $("#CategoriaID").val('0')
  $("#CategoriaID-error").text("")

  $("#errorDescripcion").text("")
  $("#errorResumen").addClass('d-none')
}

// ------------- CRUD -------------
function guardarSubcategoria() {
  const id = Number($("#subCategoriaId").val())
  const descripcion = $("#subcategoriaDescripcion").val()
  const categoriaSeleccionada = $("#CategoriaID").val()
  
  const tituloAccion = $('.modal-title').text()

  if(!$('#formModal').valid()) return;

  $.ajax({
    url : '../../SubCategoria/GuardarSubCategoria',
    data : { descripcion, id, categoriaId: categoriaSeleccionada },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {

      if(resultado > 0){
        const mensajes = {
          '1': 'Complete los campos marcados como requeridos.',
          '2': 'Ya existe una subcategoría con la misma descripción y en la misma categoria.',
          '3': 'No se pudo encontrar la subcategoria'
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

      buscarSubCategorias();
      $("#modalSubcategoria").modal('hide');
      toast({ 
        type: 'success',
        title: tituloAccion,
        message: 'Subcategoria guardada correctamente.'
      })

    },
    error: function(_error) {
      $("#modalSubcategoria").modal('hide');
      toast({ type: 'error', title: tituloAccion, message: 'Lo sentimos, algo salio mal.' })
    },
  });
}

function buscarSubCategorias (){
  const cantidadSubcategorias = $('#cantidad_subcategorias')
  $.ajax({
    url : '../../SubCategoria/BuscarSubCategorias',
    data : {  },
    type : 'GET',
    dataType : 'json',
    success : function(subcategorias) {

      const cantidadCategoriasTxt = subcategorias && subcategorias.length 
        ? `${subcategorias.length} subcategorias`
        : 'No hay subcategorias';

        cantidadSubcategorias.text(cantidadCategoriasTxt);

      $('#tabla_subcategoria').DataTable().destroy();
      $("#tBody").empty();

      subcategorias.forEach(subcategoria=> {

        const acciones =  `
          <td class="text-end">
            ${!subcategoria.eliminado
              ? `
                <button type="button" class="btn btn-primary btn-sm" onclick="buscarSubCategoria(${subcategoria.subCategoriaID})">
                  Editar
                </button>`
              : ''
            }
            <button type="button" class="btn btn-${subcategoria.eliminado ? 'success' : 'danger'} btn-sm" onclick="eliminarSubCategoria(${subcategoria.subCategoriaID}, ${!subcategoria.eliminado})">
              ${subcategoria.eliminado ? 'Habilitar' : 'Deshabilitar'}
            </button>
          </td>
        `

        $("#tBody").append(`
          <tr data-disabled="${subcategoria.eliminado}">
            <td class="${subcategoria.eliminado ? 'text-decoration-line-through' : ''}">
              ${subcategoria.descripcion}
            </td>
            <td>
              <span class="badge bg-info text-dark ${
                subcategoria.eliminado ? 'text-decoration-line-through' : ''}"> ${subcategoria.categoriaDescripcion} </span>
            </td>
    
            ${acciones}
          </tr>
        `);

      })

      $('#tabla_subcategoria').DataTable(configDatatable);

      // filtrarPorBusqueda(document.querySelector('#buscador').value)
      // manejoDeFiltro()
    },

    error: function(error) {
      toast({ 
        type: 'error', 
        title: 'Busqueda de subcategorias',
        message: 'Lo sentimos. No se pudo recuperar las subcategorias.'
      })

      $('#tBody').html('')
      $('#tFooter tr td:first-child').text('No se encontraron subcategorias')
      cantidadSubcategorias.html('No hay subcategorias')
    },

  });
}

function buscarSubCategoria(subCategoriaId) {
  $.ajax({
    url : '../../SubCategoria/BuscarSubCategorias',
    data : { subCategoriaId: subCategoriaId },
    type : 'GET',
    dataType : 'json',

    success : function(subcategorias) {
      if (subcategorias.length == 1){
        const subcategoria = subcategorias[0];

        $("#subCategoriaId").val(subcategoria.subCategoriaID)
        $("#subcategoriaDescripcion").val(subcategoria.descripcion)
        $("#CategoriaID").val(subcategoria.categoriaID)

        $("#modalSubcategoria").modal("show");
      }
    },
    error : function(xhr, status) {

      toast({ 
        type: 'error',
        title: 'Buscar subcategoria',
        message: 'Lo sentimos. No se pudo recuper la subcategoria.'
      })
    },
  });
}

function eliminarSubCategoria(id, valor) {

  $.ajax({
    url : '../../SubCategoria/EliminarSubCategoria',
    data : { id, valor },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      
      if(resultado === 0){
        buscarSubCategorias()
      } else {
        const mensajes = {
          '3': 'No se pudo eliminar la subcategoria.',
          '4': 'No se puede eliminar la subcategoria porque existe en un servicio. Elimine primero este.'
        }
        
        toast({ type: 'error', title: 'Eliminar subcategoria', message: mensajes?.[resultado] })
      }
    },

    error : function(_error) {
      toast({ 
        type: 'error',
        title: 'Eliminar subcategoria',
        message: 'Lo sentimos. No se pudo eliminar la subcategoria.'
      })
    },
  });
}
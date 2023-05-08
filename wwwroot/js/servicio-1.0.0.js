$(document).ready(function() {

  $("#modal").on('hide.bs.modal', function(){
    limpiarFormulario()
  });
  
  $("#modal").on('show.bs.modal', function(){
    const tituloModal = document.getElementById('modalTitulo')
    const id = $("#servicioId").val();

    tituloModal.innerText = id === '0' ? 'Agregar servicio' : 'Actualizar servicio'
  });
  
  $('#formModal').validate({
    errorClass: 'text-danger small d-block mt-1',
    rules: {
      servicioDescripcion: "required",
      servicioDireccion: "required",
      servicioTelefono: "required",
      SubCategoriaID: "required",
    },
    messages: {
      servicioDescripcion: "La descripción del servicio es requerida. Ingrese una.",
      servicioDireccion: "La direccion del servicio es requerida. Ingrese una.",
      servicioTelefono: "El telefono del servicio es requerido. Ingrese uno.",
      SubCategoriaID: "La subcategoria es requerida. Ingrese una.",
    },
  })
  
  const inputBuscador = document.getElementById('buscador')
  inputBuscador.addEventListener('input', filtrarPorBusqueda)

  const TIEMPO_DE_ESPERA = 700;
  setTimeout(function () {
    buscarServicios()

    const filtros = $('#filtros');
    filtros.on("change", manejoDeFiltro);
  }, TIEMPO_DE_ESPERA)
})

function limpiarFormulario() {
  const formularioModal = document.getElementById("formModal")
  formularioModal.reset();
  $("#servicioId").val(0);
  $("#subcategorias").val(0);

  // LIMPIAR MENSAJES DE ERROR
  $("#servicioDescripcion-error").text("")
  $("#servicioDireccion-error").text("")
  $("#servicioTelefono-error").text("")
  $("#subcategorias-error").text("")
}

// -------------------------------
// --------- CRUD -------------
// -------------------------------
function guardarServicio() {
  const formularioModal = document.getElementById("formModal")
  const data = [...formularioModal.elements].reduce((acc, elemento)=> {
    acc[elemento.name] = elemento.value
    return acc;
  }, {});
  
  if(!$('#formModal').valid()){
    return;
  }

  $.ajax({
    url : '../../Servicio/GuardarServicio',
    data : {
      id: data.servicioId,
      descripcion: data.servicioDescripcion,
      direccion: data.servicioDireccion,
      telefono: data.servicioTelefono,
      subCategoriaId: data.SubCategoriaID
    },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      // console.log(resultado);

      if(resultado > 0){
        const mensajes = {
          '1': 'Complete los campos marcados como requeridos.',
          '2': 'Ya existe un servicio con la misma descripción y en la misma subcategoria.',
          '3': 'No se pudo encontrar el servicio'
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

      buscarServicios();
      $("#modal").modal('hide');

    },
    error : function(error) {
      $("#modal").modal('hide');
      mostrarErrorGeneral('Lo sentimos, algo salio mal.');
    },
  });
}

function buscarServicios (){

  $.ajax({
    url : '../../Servicio/BuscarServicios',
    data : {},
    type : 'GET',
    dataType : 'json',
    success : function(servicios) {

      const cantidadServiciosTxt = servicios && servicios.length 
        ? `${servicios.length} servicios`
        : 'No hay servicios';

      $('#cantidad_servicios').text(cantidadServiciosTxt);
      $("#tBody").empty();

      servicios.forEach(servicio=> {

        const acciones =  `
          <td class="text-end">
            ${!servicio.eliminado
              ? `
                <button type="button" class="btn btn-primary btn-sm" onclick="buscarServicio(${servicio.serviciosID})">
                  Editar
                </button>`
              : ''
            }
            <button type="button" class="btn btn-${servicio.eliminado ? 'success' : 'danger'} btn-sm" onclick="eliminarServicio(${servicio.serviciosID}, ${!servicio.eliminado})">
              ${servicio.eliminado ? 'Habilitar' : 'Deshabilitar'}
            </button>
          </td>
        `

        const classDeshabilitado = servicio.eliminado ? 'text-decoration-line-through' : '';

        $("#tBody").append(`
          <tr data-disabled="${servicio.eliminado}">
            <td class="${classDeshabilitado}">
              ${servicio.descripcion}
            </td>
            <td class="${classDeshabilitado}">
              ${servicio.direccion}
            </td>
            <td class="${classDeshabilitado}">
              ${servicio.telefono}
            </td>
            <td class="">
              <span class="badge bg-info text-dark ${classDeshabilitado}"> 
                ${servicio.subCategoriaDescripcion}
              </span>
            </td>
            <td class="">
              <span class="badge bg-warning text-dark ${classDeshabilitado}">
                ${servicio.categoriaDescripcion}
              </span>
            </td>
    
            ${acciones}
          </tr>
        `);

      })

      filtrarPorBusqueda(document.querySelector('#buscador').value)
      manejoDeFiltro()
    },

    error : function(error) {
      mostrarErrorGeneral('Lo sentimos. No se pudo recuperar los servicios.');
    },

  });
}

function buscarServicio(servicioId) {
  $.ajax({
    url : '../../Servicio/BuscarServicios',
    data : { servicioId: servicioId },
    type : 'GET',
    dataType : 'json',
    success : function(servicios) {
      if (servicios.length == 1){
        const servicio = servicios[0];

        $("#servicioId").val(servicio.serviciosID)
        $("#servicioDescripcion").val(servicio.descripcion)
        $("#servicioDireccion").val(servicio.direccion)
        $("#servicioTelefono").val(servicio.telefono)

        $("#subcategorias").val(servicio.subCategoriaID)

        $("#modal").modal("show");
      }
    },
    error : function(_xhr, _status) {
      mostrarErrorGeneral('Lo sentimos. No se pudo recuperar el servicio.');
    },
  });
}

function eliminarServicio(id, valor) {
  $.ajax({
    url : '../../Servicio/EliminarServicio',
    data : { id, valor },
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      
      if(resultado === 0){
        buscarServicios()
      } else {
        const mensajes = {
          '3': 'No se pudo eliminar el servicio.',
        }
        
        mostrarErrorGeneral(mensajes?.[resultado])
      }
    },

    error : function(error) {
      // console.log(error);
      mostrarErrorGeneral('Lo sentimos no se pudo eliminar el servicio.')
    },
  });
}
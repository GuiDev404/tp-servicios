function filtrarPorBusqueda(e){
  const busqueda = typeof e === 'string' ? e : e.target.value.trim().toUpperCase();
  const filas = [...document.querySelectorAll('#tBody tr')]

  filas.forEach(fila=> {
    fila.classList.add('d-none')
    
    // CELDAS DONDE SE HARA LA BUSQUEDA (TODAS LAS CELDAS MENOS LA DE LOS BOTONES)
    const tds = fila.querySelectorAll('td:not(:last-child)')
    
    // AL MENOS UNA CELDA(<td>) COINCIDE CON LA BUSQUEDA
    const busquedaOk = [...tds].some(td=> td.innerText.trim().toUpperCase().includes(busqueda))
    if(busquedaOk){
      fila.classList.remove('d-none')
    }

    // NINGUNA FILA(<tr>) TIENE COINCIDENCIA
    const noHayResultados = filas.every(tr=> tr.classList.contains('d-none'))

    document.querySelector('#tFooter tr > td').innerHTML = noHayResultados 
      ? `No hay resultados para <strong> ${busqueda} </strong>` 
      : ''
    
  })

}

function mostrarErrorGeneral(mensaje) {
  if(mensaje && !mensaje.trim()) return;

  const elementoAlerta = $('#errorGeneral')

  elementoAlerta
    .text(mensaje)
    .removeClass('d-none')

  setTimeout(()=> {
    elementoAlerta.addClass('d-none')
  }, 3000)
}

function manejoDeFiltro() {
  const filtros = document.querySelector('#filtros')
  
  if(filtros !== null){
    const filtroSeleccionado = filtros.value;
    
    const options = {
      'TODOS': document.querySelectorAll('#tBody tr:not(d-none)'),
      'DESHABILITADOS': document.querySelectorAll('#tBody tr[data-disabled="true"]:not(d-none)'),
      'HABILITADOS': document.querySelectorAll('#tBody tr[data-disabled="false"]:not(d-none)')
    }
  
    if(filtroSeleccionado !== 'PLACEHOLDER'){
      options['TODOS'].forEach(e=> e.classList.add('filtro-hide'))
 
      options[filtroSeleccionado].forEach(e=> e.classList.remove('filtro-hide'))
    }
  
  }
 
}

function toast({ type, message, title }) {
  Swal.fire({
    title: title,
    text: message,
    icon: type,
    toast: true,
    position: "bottom-end",
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
}

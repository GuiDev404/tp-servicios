function filtrarPorBusqueda(e){
  const busqueda = e.target.value.trim().toUpperCase();
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
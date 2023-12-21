
if(jQuery.validator){
  jQuery.validator.addMethod("selected", function(value, element) {
    if(value){
      return element.value !== '0';
    }
    
    return true;
  });
}

// const getElementsByFilter = ()=> ({
//   'TODOS': document.querySelectorAll('#tBody tr'),
//   'DESHABILITADOS': document.querySelectorAll('#tBody tr[data-disabled="true"]:not(d-none)'),
//   'HABILITADOS': document.querySelectorAll('#tBody tr[data-disabled="false"]:not(d-none)')
// })

// function filtrarPorBusqueda(input){
//   const busqueda = typeof input === 'string' ? input : input.target?.value.trim().toUpperCase();
  
//   const url = new URL(window.location.href)
//   url.searchParams.set('q', busqueda)
//   window.history.pushState({ ...window.history.state, busqueda: busqueda }, 'query-search', url.href);

//   let filas = getElementsByFilter()[window.history.state.filtro] || document.querySelectorAll('#tBody tr');
//   [...filas].forEach(e=> e.classList.remove('filtro-hide'));

//   [...filas].forEach(fila=> {
//     fila.classList.add('d-none')
    
//     // CELDAS DONDE SE HARA LA BUSQUEDA (TODAS LAS CELDAS MENOS LA DE LOS BOTONES)
//     const tds = fila.querySelectorAll('td:not(:last-child)')
    
//     // AL MENOS UNA CELDA(<td>) COINCIDE CON LA BUSQUEDA
//     const busquedaOk = [...tds].some(td=> td.innerText.trim().toUpperCase().includes(busqueda))
//     if(busquedaOk){
//       fila.classList.remove('d-none')
//     }

//     // NINGUNA FILA(<tr>) TIENE COINCIDENCIA
//     const noHayResultados = [...filas].every(tr=> tr.classList.contains('d-none'))

//     document.querySelector('#tFooter tr > td').innerHTML = noHayResultados 
//       ? `No hay resultados para <strong> ${busqueda} </strong>` 
//       : ''
    
//   })

// }

// function manejoDeFiltro() {
//   const filtros = document.querySelector('#filtros')
  
//   if(filtros !== null){
//     const filtroSeleccionado = filtros.value;

//     const params = new URL(window.location.href)
//     params.searchParams.set('filter', filtroSeleccionado.toLowerCase());
    
//     const options = getElementsByFilter();
    

//     window.history.pushState({ filtro: filtroSeleccionado }, 'query-params', params.href)
//     const qParam = params.searchParams.get('q')

//     if(filtroSeleccionado !== 'PLACEHOLDER'){
//       options['TODOS'].forEach(e=> e.classList.add('d-none'))

//       options[filtroSeleccionado].forEach(fila=> {
        
//         const tds = fila.querySelectorAll('td:not(:last-child)')

//         const busquedaOk = [...tds].some(td=> td.innerText.trim().toUpperCase().includes(qParam))
//         if(busquedaOk){
//           fila.classList.remove('d-none')
//           return;
//         }

//         fila.classList.remove('d-none')
      
//       })
//     }
    
//   }
 
// }

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

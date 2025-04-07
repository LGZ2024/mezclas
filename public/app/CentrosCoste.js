/* eslint-disable no-undef */
import { setPost, setPostVariedad } from './postList.js'

async function centrosCoste (rancho) {
  const response = await fetchCC(rancho)
  setPost(response)
}
async function Variedades (id) {
  const response = await fetchVariedad(id)
  setPostVariedad(response)
}
async function cambioSolicitud ({ selecion, variedad, porcentaje }) {
  // Validar y separar datos
  let variedades = variedad.split(',')
  let porcentajes = porcentaje.split(',')

  // Eliminar el último elemento de ambos arrays
  variedades = variedades.slice(0, -1)
  porcentajes = porcentajes.slice(0, -1)

  console.log(variedades)
  console.log(porcentajes)

  if (variedades.length !== porcentajes.length) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cantidad de variedades no coincide con la cantidad de porcentajes'
    })
    return
  }

  // Crear HTML para la tabla de variedades y porcentajes
  const crearTablaHTML = () => {
    let html = `
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-center">Variedad</th>
                            <th class="text-center">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
        `

    // Agregar filas con los datos
    variedades.forEach((variedad, index) => {
      html += `
                <tr>
                    <td class="text-left">${variedad.trim()}</td>
                    <td class="text-center">${porcentajes[index].trim()}%</td>
                </tr>
            `
    })

    html += `
                    </tbody>
                </table>
            </div>
        `

    return html
  }

  // aqui se muestra la tabla de porcentajes si se selecciona la opcion 'todo'
  if (selecion === 'todo') {
    const tablaHTML = crearTablaHTML()

    Swal.fire({
      title: 'Porcentajes por Variedad',
      html: tablaHTML,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Editar',
      customClass: {
        confirmButton: 'btn btn-success order-2',
        denyButton: 'btn btn-primary order-1'
      },
      width: '400px'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Confirmado',
          text: 'Los porcentajes han sido guardados'
        })
      } else if (result.isDenied) {
        // mostrar modas
        const modal = $('#ModalEditar')
        document.getElementById('exampleModalLabel').textContent = 'Editar Porcentajes'
        modal.modal('show')
        crearFormulario({ variedades, porcentajes })
      }
    })
  }
  // aqui selecionamos select option con id='metodoAplicacion' con value 'Preparacion de Tierras'.  si la seleccion es === 'NSC' y desabilitar el select
  if (selecion === 'NSC') {
    const select = document.getElementById('metodoAplicacion')
    select.disabled = true
    select.value = 'Preparacion de Tierras'
  } else {
    // habilitar el select
    const select = document.getElementById('metodoAplicacion')
    select.disabled = false
  }
}

// crear formulario para la solicitud de cambio de porcentajes
const crearFormulario = ({ variedades, porcentajes }) => {
  const formulario = document.getElementById('formPorcentaje')
  formulario.innerHTML = ''
  variedades.forEach((variedad, index) => {
    const div = document.createElement('div')
    div.classList.add('formulario__campo')
    div.innerHTML = `
            <label class="text-left formulario__label">${variedad.trim()}</label>
            <input type="number" class="formulario__input" name="porcentaje[]" value="${porcentajes[index].trim()}" required>
        `
    formulario.appendChild(div)
  })
  // Agregar boton de submit al formulario
  const div = document.createElement('div')
  div.classList.add('formulario__campo')
  div.innerHTML = `
        <button type="submit" class="btn formulario__submit m-4">Guardar</button>
        <button type="button" id='CerrarPorcentaje' class="btn formulario__submit m-4">Cancelar</button>
    `
  formulario.appendChild(div)

  // agregamos evento para botn cerrar el porcentaje
  document.getElementById('CerrarPorcentaje').addEventListener('click', () => {
    const modal = $('#ModalEditar')
    modal.modal('hide', true)
    Swal.fire({
      title: 'Cancelado',
      text: 'Se cancelo la edicion de porcentajes, se mantendran los mismo valores del formulario',
      icon: 'info'
    })
  })
}

async function fetchCC (rancho) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(`/api/cc/${rancho}`, options)
  const data = await response.json()
  return data
}

async function fetchVariedad (id) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(`/api/variedades/${id}`, options)
  const data = await response.json()
  return data
}
export { centrosCoste, Variedades, cambioSolicitud }

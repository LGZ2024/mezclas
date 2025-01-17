/* eslint-disable no-undef */
import { mostrarMensaje } from '../funciones.js'

// Métodos de manejo de eventos
export const manejarEnvioReceta = async (e) => {
  e.preventDefault()
  const contrasena = document.getElementById('contrasena').value
  const contrasenaRep = document.getElementById('contrasenaRep').value

  if (!validarFormulario() || !validarContraseña(contrasena, contrasenaRep) || !validarProductos()) {
    return
  }

  const datosReceta = await recopilarDatosReceta()
  try {
    const respuesta = await enviarReceta(datosReceta)
    procesarRespuestaReceta(respuesta)
  } catch (error) {
    manejarErrorReceta(error)
  }
}
const validarFormulario = () => {
  const camposRequeridos = ['nombre', 'correo', 'contrasena', 'contrasenaRep', 'roles', 'empresa']
  const camposInvalidos = camposRequeridos.filter(campo => {
    const elemento = document.getElementById(campo)
    return !elemento.value.trim()
  })

  if (camposInvalidos.length > 0) {
    mostrarMensaje(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`, 'info', true)
    return false
  }

  return true
}

const validarProductos = () => {
  const ranchos = document.querySelectorAll('select[name="rancho[]"]')
  const ranchosUnicos = new Set()
  const errores = []

  ranchos.forEach(ranchosSelect => {
    const producto = ranchosSelect.value

    if (!producto) {
      errores.push('Debe seleccionar un producto')
    } else if (ranchosUnicos.has(producto)) {
      errores.push('No se pueden agregar productos duplicados')
    } else {
      ranchosUnicos.add(producto)
    }
  })

  if (errores.length > 0) {
    mostrarError([...new Set(errores)].join('. '))
    return false
  }

  return true
}

export const validarContraseña = async (contrasena, contrasenaRep) => {
  // exprecion algebraica para
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

  if (!regex.test(contrasena)) {
    mostrarMensaje('La contraseña no cumple con los requisitos', 'info', true)
    return false
  }

  if (contrasena !== contrasenaRep) {
    mostrarMensaje('Las contraseñas no coinciden', 'info')
    return false
  }

  return true
}

// Métodos de procesamiento de datos
const recopilarDatosReceta = async () => {
  const ranchos = await recopilarProductos()
  return {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('correo').value,
    password: document.getElementById('contrasena').value,
    rol: document.getElementById('rol').value,
    empresa: document.getElementById('empresa').value,
    ranchos
  }
}

const recopilarProductos = async () => {
  const ranchosSeleccionados = document.querySelectorAll('select[name="rancho[]"]')
  return Array.from(ranchosSeleccionados)
    .map(rancho => rancho.value)
    .filter(value => value) // Filtrar valores vacíos
    .join(',') // Unir en una cadena separada por comas
}

const procesarRespuestaReceta = (respuesta) => {
  document.getElementById('formEditar').reset()

  if (!respuesta.error) {
    mostrarMensaje(respuesta.message || 'Receta guardada exitosamente', 'success')
    reiniciarCamposProductos()
  } else {
    mostrarMensaje(respuesta.error || 'Error al procesar la respuesta', 'error')
  }
}

const reiniciarCamposProductos = () => {
  const ranchosContainer = document.getElementById('ranchosContainer')
  while (ranchosContainer.firstChild) {
    ranchosContainer.removeChild(ranchosContainer.firstChild)
  }
}

const enviarReceta = async (datosReceta) => {
  const respuesta = await fetch('/api/usuario/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosReceta)
  })

  if (!respuesta.ok) {
    const errorDetallado = await respuesta.json()
    return { error: errorDetallado.error }
  }

  return await respuesta.json()
}

const manejarErrorReceta = (error) => {
  console.error('Error al guardar receta:', error)
  alert(error.message || 'Ocurrió un error al guardar la receta')
}

// Métodos para mostrar o ocultar contraseñas
export const mostrarContraseñaR = () => {
  $(document).on('click', '#mostrarPassR', function (e) {
    e.preventDefault()
    const contrasenaRepInput = document.getElementById('contrasenaRep')
    contrasenaRepInput.type = contrasenaRepInput.type === 'password' ? 'text' : 'password'
  })
}

export const mostrarContraseña = () => {
  $(document).on('click', '#mostrarPass', function (e) {
    e.preventDefault()
    const contrasenaInput = document.getElementById('contrasena')
    contrasenaInput.type = contrasenaInput.type === 'password' ? 'text' : 'password'
  })
}

// Métodos para agregar ranchos a los usuarios
export const agregarNuevoRancho = () => {
  const datos = [
    { nombre: 'Ahualulco' },
    { nombre: 'Atemajac' },
    { nombre: 'Casas de Altos' },
    { nombre: 'Ojo de Agua' },
    { nombre: 'Potrero' },
    { nombre: 'Romero' },
    { nombre: 'Seccion 7 Fresas' },
    { nombre: 'Zapote' }
  ]

  document.getElementById('agregarRancho').addEventListener('click', () => {
    crearCampoRancho(datos)
  })
}
// crear rancho nuevo
const crearCampoRancho = (datos) => {
  const ranchosContainer = document.getElementById('ranchosContainer')
  const nuevoRancho = document.createElement('div')
  nuevoRancho.classList.add('form-group')

  const selectRancho = document.createElement('select')
  selectRancho.name = 'rancho[]'
  selectRancho.classList.add('form-control', 'producto-item')
  selectRancho.required = true

  let option = document.createElement('option')
  option.classList.add('select-producto')
  option.value = ''
  option.textContent = 'Selecciona Un Rancho'
  selectRancho.appendChild(option)

  datos.forEach(producto => {
    option = document.createElement('option')
    option.value = producto.nombre
    option.textContent = producto.nombre
    selectRancho.appendChild(option)
  })

  nuevoRancho.innerHTML = `
        <label for="rancho">Rancho</label>
          ${selectRancho.outerHTML}
        <div class="acciones-producto">
          <button type="button" class="btn btn-secondary eliminar-producto formulario__submit btn-eliminar">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
    `
  ranchosContainer.appendChild(nuevoRancho)

  const botonEliminar = nuevoRancho.querySelector('.eliminar-producto')
  botonEliminar.addEventListener('click', () => {
    const productosActuales = document.querySelectorAll('.producto-item')
    if (productosActuales.length > 1) {
      nuevoRancho.remove()
    } else {
      alert('Debe haber al menos un producto')
    }
  })

  return nuevoRancho
}

// // Metodos de manejo rol
export const manejarCambioCentroCoste = () => {
  document.getElementById('rol').addEventListener('change', (evento) => {
    const rol = evento.target.value
    document.getElementById('agregarRancho').style.display = rol === 'admin' ? 'none' : 'block'
  })
}

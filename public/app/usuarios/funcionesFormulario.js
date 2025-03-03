// importar componentes y funciones necesarias
import { mostrarMensaje } from '../funciones.js'
import { iniciarRegistros, verRegistro } from './tablaUsuarios.js'
/* eslint-disable no-undef */
class FormularioUsuario {
  constructor () {
    this.datosRancho = [
      { nombre: 'Ahualulco' },
      { nombre: 'Atemajac' },
      { nombre: 'Casas de Altos' },
      { nombre: 'Ojo de Agua' },
      { nombre: 'Potrero' },
      { nombre: 'Romero' },
      { nombre: 'Seccion 7 Fresas' },
      { nombre: 'Zapote' }
    ]
    this.datosVariedad = [
      { variedad: 'Marilyn' },
      { variedad: 'Mya' },
      { variedad: 'Jazmin' },
      { variedad: 'Rebecas' },
      { variedad: 'Lauritas' },
      { variedad: 'Paulinas' },
      { variedad: 'BT304.3' },
      { variedad: 'Elviras' },
      { variedad: 'Normitas' },
      { variedad: 'Aranas' },
      { variedad: 'Kirras' },
      { variedad: 'Dupre' },
      { variedad: 'Corrina' },
      { variedad: 'Minerva' },
      { variedad: 'Dayana' },
      { variedad: 'Yuritzi' },
      { variedad: 'Marisabel' },
      { variedad: 'Maiz' }
    ]
  }

  async manejarEnvioReceta (e) {
    e.preventDefault()
    const contrasena = document.getElementById('contrasena').value
    const contrasenaRep = document.getElementById('contrasenaRep').value
    // comprobamos los campos de rancho se hayan creado en caso de que si validamos
    const ranchos = document.querySelectorAll('select[name="rancho[]"]')
    if (ranchos.length === 0) {
      if (!this.validarFormulario() || !(await this.validarContraseña(contrasena, contrasenaRep))) {
        return
      }
    } else {
      if (!this.validarFormulario() || !(await this.validarContraseña(contrasena, contrasenaRep)) || !this.validarProductos()) {
        return
      }
    }

    const datosReceta = await this.recopilarDatosReceta()
    try {
      const respuesta = await this.enviarReceta(datosReceta)
      this.procesarRespuestaReceta(respuesta)
    } catch (error) {
      this.manejarErrorReceta(error)
    }
  }

  validarFormulario () {
    const camposRequeridos = ['nombre', 'usuario', 'correo', 'contrasena', 'contrasenaRep', 'roles', 'empresa']
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

  validarProductos () {
    const ranchos = document.querySelectorAll('select[name="rancho[]"]')
    const ranchosUnicos = new Set()
    const errores = []

    ranchos.forEach(ranchoSelect => {
      const producto = ranchoSelect.value

      if (!producto) {
        errores.push('Debe seleccionar un producto')
      } else if (ranchosUnicos.has(producto)) {
        errores.push('No se pueden agregar productos duplicados')
      } else {
        ranchosUnicos.add(producto)
      }
    })

    if (errores.length > 0) {
      this.mostrarError([...new Set(errores)].join('. '))
      return false
    }
    return true
  }

  validarVariedades () {
    const variedades = document.querySelectorAll('select[name="variedad[]"]')
    const variedadesUnicas = new Set()
    const errores = []

    variedades.forEach(variedadSelect => {
      const variedad = variedadSelect.value
      if (!variedad) {
        errores.push('Debe seleccionar una variedad')
      } else if (variedadesUnicas.has(variedad)) {
        errores.push('No se pueden agregar variedades duplicadas')
      } else {
        variedadesUnicas.add(variedad)
      }
    })

    if (errores.length > 0) {
      this.mostrarError([...new Set(errores)].join('. '))
      return false
    }
    return true
  }

  async validarContraseña (contrasena, contrasenaRep) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

    if (!regex.test(contrasena)) {
      await mostrarMensaje('La contraseña no cumple con los requisitos', 'info', true)
      return false
    }

    if (contrasena !== contrasenaRep) {
      await mostrarMensaje('Las contraseñas no coinciden', 'info', true)
      return false
    }

    return true
  }

  async recopilarDatosReceta () {
    const ranchos = await this.recopilarProductos()
    if (!ranchos) {
      return {
        nombre: document.getElementById('nombre').value,
        usuario: document.getElementById('usuario').value,
        email: document.getElementById('correo').value,
        password: document.getElementById('contrasena').value,
        rol: document.getElementById('roles').value,
        empresa: document.getElementById('empresa').value
      }
    }
    return {
      nombre: document.getElementById('nombre').value,
      usuario: document.getElementById('usuario').value,
      email: document.getElementById('correo').value,
      password: document.getElementById('contrasena').value,
      rol: document.getElementById('roles').value,
      empresa: document.getElementById('empresa').value,
      ranchos
    }
  }

  async recopilarProductos () {
    const ranchosSeleccionados = document.querySelectorAll('select[name="rancho[]"]')
    console.log(ranchosSeleccionados)
    return Array.from(ranchosSeleccionados)
      .map(rancho => rancho.value)
      .filter(value => value) // Filtrar valores vacíos
      .join(',') // Unir en una cadena separada por comas
  }

  async recopilarVariedades () {
    const variedadesSeleccionadas = document.querySelectorAll('select[name="variedad[]"]')
    return Array.from(variedadesSeleccionadas)
      .map(variedad => variedad.value)
      .filter(value => value)
      .join(',')
  }

  procesarRespuestaReceta (respuesta) {
    if (!respuesta.error) {
      mostrarMensaje(respuesta.message || 'Receta guardada exitosamente', 'success')
      document.getElementById('formEditar').reset()
      $('#exampleModal').modal('hide')
      this.reiniciarCamposProductos()
      iniciarRegistros()
      verRegistro()
    } else {
      mostrarMensaje(respuesta.error || 'Error al procesar la respuesta', 'error')
    }
  }

  reiniciarCamposProductos () {
    const ranchosContainer = document.getElementById('ranchosContainer')
    while (ranchosContainer.firstChild) {
      ranchosContainer.removeChild(ranchosContainer.firstChild)
    }
  }

  async enviarReceta (datosReceta) {
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

  manejarErrorReceta (error) {
    console.error('Error al guardar receta:', error)
    alert(error.message || 'Ocurrió un error al guardar la receta')
  }

  mostrarContraseñaR () {
    $(document).on('click', '#mostrarPassR', (e) => {
      e.preventDefault()
      const contrasenaRepInput = document.getElementById('contrasenaRep')
      contrasenaRepInput.type = contrasenaRepInput.type === 'password' ? 'text' : 'password'
    })
  }

  mostrarContraseña () {
    $(document).on('click', '#mostrarPass', (e) => {
      e.preventDefault()
      const contrasenaInput = document.getElementById('contrasena')
      contrasenaInput.type = contrasenaInput.type === 'password' ? 'text' : 'password'
    })
  }

  agregarNuevoRancho () {
    document.getElementById('agregarRancho').addEventListener('click', () => {
      this.crearCampoRancho(this.datosRancho)
    })
  }

  agregarNuevoVariedad () {
    document.getElementById('agregarVariedad').addEventListener('click', () => {
      this.crearCampoVariedad(this.datosVariedad)
    })
  }

  crearCampoRancho (datos) {
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

  crearCampoVariedad (datos) {
    const variedadContainer = document.getElementById('variedadesContainer')
    const nuevoVariedad = document.createElement('div')
    nuevoVariedad.classList.add('form-group')

    const selectVaridad = document.createElement('select')
    selectVaridad.name = 'variedad[]'
    selectVaridad.classList.add('form-control', 'variedad-item')
    selectVaridad.required = true

    let option = document.createElement('option')
    option.classList.add('select-variedad')
    option.value = ''
    option.textContent = 'Selecciona una Variedad'
    selectVaridad.appendChild(option)

    datos.forEach(variedades => {
      option = document.createElement('option')
      option.value = variedades.variedad
      option.textContent = variedades.variedad
      selectVaridad.appendChild(option)
    })

    nuevoVariedad.innerHTML = `
      <label for="variedad">Variedad</label>
      ${selectVaridad.outerHTML}
      <div class="acciones-variedad">
        <button type="button" class="btn btn-secondary eliminar-variedad formulario__submit btn-eliminar">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `
    variedadContainer.appendChild(nuevoVariedad)

    const botonEliminar = nuevoVariedad.querySelector('.eliminar-variedad')
    botonEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.variedad-item')
      if (productosActuales.length > 1) {
        nuevoVariedad.remove()
      } else {
        alert('Debe haber al menos un producto')
      }
    })

    return nuevoVariedad
  }

  manejarCambioCentroCoste () {
    document.getElementById('rol').addEventListener('change', (evento) => {
      const rol = evento.target.value
      document.getElementById('agregarRancho').style.display = rol === 'admin' ? 'none' : 'block'
    })
  }

  mostrarError (mensaje) {
    console.error(`ERROR: ${mensaje}`)
  }
}

export default FormularioUsuario

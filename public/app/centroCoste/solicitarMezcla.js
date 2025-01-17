import { mostrarMensaje } from '../funciones.js'

export class SolicitudFormulario {
  constructor () {
    this.productosData = [] // Variable para almacenar productos
    this.initElements()
    this.bindEvents()
  }

  initElements () {
    this.elementos = {
      productosContainer: document.getElementById('productosContainer'),
      agregarProductoBtn: document.getElementById('agregarProducto'),
      recetaForm: document.getElementById('formCentroCostes')
    }
  }

  bindEvents () {
    // Verifica que this.elementos.unidadMedida sea un elemento válido
    this.elementos.recetaForm.addEventListener('submit', this.manejarEnvioReceta.bind(this))
    this.elementos.agregarProductoBtn.addEventListener('click', this.agregarNuevoProducto)
  }

  // Métodos de validación
  validarFormulario () {
    const camposRequeridos = [
      'rancho', 'centroCoste', 'cultivo'
    ]

    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      this.mostrarError(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`)
      return false
    }

    return true
  }

  validarProductos () {
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]')

    const productosUnicos = new Set()

    const errores = []

    cantidades.forEach((cantidadSelect, index) => {
      const cantidad = cantidadSelect.value

      if (!cantidad) {
        errores.push('Debe ingresar una cantidad válida')
        cantidades[index].classList.add('input-error')
      }

      if (cantidad) {
        if (productosUnicos.has(cantidad)) {
          errores.push('No se pueden agregar variedades duplicadas')
          cantidadSelect.classList.add('input-error')
        } else {
          productosUnicos.add(cantidad)
        }
      }
    })

    if (errores.length > 0) {
      const erroresUnicos = [...new Set(errores)]
      this.mostrarError(erroresUnicos.join('. '))
      return false
    }

    return true
  }

  // Métodos de manejo de eventos
  manejarEnvioReceta = async (e) => {
    e.preventDefault()

    // Limpiar errores previos
    document.querySelectorAll('.input-error').forEach(el => {
      el.classList.remove('input-error')
    })

    // Validación general del formulario
    if (!this.validarFormulario()) {
      return
    }

    // Validación específica de productos
    if (!this.validarProductos()) {
      return
    }

    // Recopilación de datos
    const datosReceta = this.recopilarDatosReceta()

    try {
      // Envío de datos al servidor
      const respuesta = await this.enviarReceta(datosReceta)

      // Procesar respuesta
      this.procesarRespuestaReceta(respuesta)
    } catch (error) {
      this.manejarErrorReceta(error)
    }
  }

  // Métodos de procesamiento de datos
  recopilarDatosReceta () {
    // OBTENEMOS DATOS DEL CENTRO DE COTE PARA SABER LA EMPRESA A LA QUE PERTENECE
    const centroCosteSelect = document.getElementById('centroCoste')
    const selectedIndex = centroCosteSelect.selectedIndex
    const selectedOption = centroCosteSelect.options[selectedIndex]
    const selectedText = selectedOption.text
    let empresaPertece = ''

    if (selectedText.substring(0, 4) === 'MFIM') {
      empresaPertece = 'Moras Finas'
    } else if (selectedText.substring(0, 4) === 'BCEM') {
      empresaPertece = 'Bayas del Centro'
    } else if (selectedText.substring(0, 4) === 'BIOJ') {
      empresaPertece = 'Bioagricultura'
    }
    const receta = {
      rancho: document.getElementById('rancho').value,
      centroCoste: document.getElementById('centroCoste').value,
      variedad: document.getElementById('variedad').value,
      folio: document.getElementById('folio').value,
      temporada: document.getElementById('temporada').value,
      cantidad: document.getElementById('cantidad').value,
      presentacion: document.getElementById('presentacion').value,
      metodoAplicacion: document.getElementById('metodoAplicacion').value,
      descripcion: document.getElementById('descripcion').value,
      productos: this.recopilarProductos(),
      empresaPertece
    }

    return receta
  }

  recopilarProductos () {
    const variedad = []
    const variedadSeleccionados = document.querySelectorAll('input[name="cantidad[]"]')

    variedadSeleccionados.forEach((producto, index) => {
      variedad.push({
        variedad: producto.value
      })
    })

    return variedad
  }

  // Métodos de envío
  enviarReceta = async (datosReceta) => {
    const respuesta = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosReceta)
    })

    if (!respuesta.ok) {
      const errorDetallado = await respuesta.json()
      throw new Error(errorDetallado.message || 'Error al guardar la receta')
    }

    return await respuesta.json()
  }

  // Métodos de respuesta
  procesarRespuestaReceta (respuesta) {
    // Resetear formulario
    this.elementos.recetaForm.reset()

    // Reiniciar campos de productos
    this.reiniciarCamposProductos()

    // Mostrar mensaje de éxito
    this.mostrarExito(respuesta.message || 'Receta guardada exitosamente')
  }

  // Métodos de UI
  reiniciarCamposProductos () {
    const productosContainer = this.elementos.productosContainer
    const productosActuales = productosContainer.querySelectorAll('.producto-item')

    // Mantener solo el primer campo, eliminar el resto
    for (let i = 1; i < productosActuales.length; i++) {
      productosActuales[i].remove()
    }

    // Resetear selects y inputs del primer campo
    const primerProducto = productosActuales[0]
    primerProducto.querySelector('input[name="cantidad[]"]').value = ''
  }

  mostrarExito (mensaje) {
    mostrarMensaje(mensaje, 'success', false)
  }

  mostrarError (mensaje) {
    console.log(mensaje)
    mostrarMensaje(mensaje, 'error', false)
  }

  manejarErrorReceta (error) {
    console.error('Error al guardar receta:', error)
    this.mostrarError(error.message || 'Ocurrió un error al guardar la receta')
  }

  navegarInicio = () => {
    window.location.href = '/protected/admin'
  }

  agregarNuevoProducto = async () => {
    try {
      // Crear nuevo campo de producto
      const nuevoCampo = this.crearCampoProducto()

      // Agregar al contenedor
      this.elementos.productosContainer.appendChild(nuevoCampo)
    } catch (error) {
      this.manejarError(error)
    }
  }

  crearCampoProducto () {
    const nuevoItem = document.createElement('div')
    nuevoItem.classList.add('producto-item')

    // Crear estructura HTML del nuevo campo
    nuevoItem.innerHTML = `
     <div class="form-group">
          <input
            class="form-control" 
            type="text" 
            name="cantidad[]" 
            placeholder="Variedad" 
            required
          >
        <div class="acciones-producto">
          <button type="button" class=" btn btn-primary eliminar-producto formulario__submit btn-eliminar">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
        </div>
    `
    // Añadir evento de cambio para el select de producto
    const botonEliminar = nuevoItem.querySelector('.eliminar-producto')
    botonEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.producto-item')
      if (productosActuales.length > 1) {
        nuevoItem.remove()
      } else {
        this.mostrarError('Debe haber al menos una variedad')
      }
    })

    return nuevoItem
  }
}

import { centrosCoste, Variedades } from '../CentrosCoste.js'
import { mostrarMensaje } from '../mensajes.js'

class SolicitudFormulario {
  constructor () {
    this.productosData = [] // Variable para almacenar productos
    this.initElements()
    this.bindEvents()
    this.inicializarFormularioProductos()
  }

  initElements () {
    this.elementos = {
      regresar: document.getElementById('regresar'),
      rancho: document.querySelector('#rancho'),
      centroCoste: document.querySelector('#centroCoste'),
      unidadMedida: document.querySelector('select[name="unidad_medida[]"]'), // Asegúrate de que este selector sea correcto
      productosContainer: document.getElementById('productosContainer'),
      agregarProductoBtn: document.getElementById('agregarProducto'),
      recetaForm: document.getElementById('recetaForm')
    }
  }

  bindEvents () {
    this.elementos.regresar.addEventListener('click', this.navegarInicio)
    this.elementos.rancho.addEventListener('change', this.manejarCambioRancho)
    this.elementos.centroCoste.addEventListener('change', this.manejarCambioCentroCoste)
    // Verifica que this.elementos.unidadMedida sea un elemento válido
    if (this.elementos.unidadMedida) {
      this.elementos.unidadMedida.addEventListener('change', this.manejarCambioUnidadMedida)
    }
    //
    this.elementos.recetaForm.addEventListener('submit', this.manejarEnvioReceta.bind(this))
    this.elementos.agregarProductoBtn.addEventListener('click', this.agregarNuevoProducto)
  }

  // Método para inicializar los productos
  async inicializarFormularioProductos () {
    try {
      // Obtener los productos
      const datos = await this.fetchProductos()

      // Obtener el select de producto del primer campo
      const primerSelectProducto = document.querySelector('.select-producto')

      // Limpiar opciones existentes
      primerSelectProducto.innerHTML = ''

      // Añadir opción por defecto
      const optionDefault = document.createElement('option')
      optionDefault.value = ''
      optionDefault.textContent = 'Seleccionar Producto'
      primerSelectProducto.appendChild(optionDefault)

      // Añadir productos al select
      const optgroupProductos = document.createElement('optgroup')
      optgroupProductos.label = 'Productos' // Etiqueta para el grupo de productos
      primerSelectProducto.appendChild(optgroupProductos)

      // Añadir productos al select
      datos.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.id_producto
        option.textContent = producto.nombre
        option.dataset.unidadBase = producto.unidad_medida
        primerSelectProducto.appendChild(option)
      })

      // Añadir evento de cambio
      primerSelectProducto.addEventListener('change', this.handleCambioProducto)

      // Configurar el select de unidad de medida
      const primerSelectUnidad = document.querySelector('.select-unidad-medida')
      primerSelectUnidad.disabled = true
      primerSelectUnidad.innerHTML = '<option value="">Seleccionar Unidad</option>'
    } catch (error) {
      this.manejarError(error)
    }
  }

  // // Método para obtener productos
  // async fetchProductos () {
  //   try {
  //     const response = await fetch('/api/productos/')
  //     if (!response.ok) {
  //       throw new Error('Error al obtener productos')
  //     }
  //     const data = await response.json()
  //     this.productosData = data
  //     return data
  //   } catch (error) {
  //     this.manejarError(error)
  //     return []
  //   }
  // }
  // Método para obtener productos
  async fetchProductos () {
    try {
      const response = await fetch('/api/productos/')
      if (!response.ok) {
        throw new Error('Error al obtener productos')
      }
      const data = await response.json()
      this.productosData = data
      return data
    } catch (error) {
      this.manejarError(error)
      return []
    }
  }

  // Métodos de validación
  validarFormulario () {
    const camposRequeridos = [
      'rancho', 'centroCoste', 'variedad', 'folio',
      'temporada', 'cantidad', 'presentacion',
      'metodoAplicacion'
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
    const productos = document.querySelectorAll('select[name="producto[]"]')
    const unidadesMedida = document.querySelectorAll('select[name="unidad_medida[]"]')
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]')

    const productosUnicos = new Set()

    const errores = []

    productos.forEach((productoSelect, index) => {
      const producto = productoSelect.value
      const unidad = unidadesMedida[index].value
      const cantidad = cantidades[index].value

      if (!producto) {
        errores.push('Debe seleccionar un producto')
        productoSelect.classList.add('input-error')
      }

      if (!unidad) {
        errores.push('Debe seleccionar una unidad de medida')
        unidadesMedida[index].classList.add('input-error')
      }

      if (!cantidad || parseFloat(cantidad) <= 0) {
        errores.push('Debe ingresar una cantidad válida')
        cantidades[index].classList.add('input-error')
      }

      if (producto) {
        if (productosUnicos.has(producto)) {
          errores.push('No se pueden agregar productos duplicados')
          productoSelect.classList.add('input-error')
        } else {
          productosUnicos.add(producto)
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

  validacionCantidad (unidad) {
    const cantidadInput = document.querySelector('input[name="cantidad[]"]')

    // Limpiar validaciones previas
    cantidadInput.setCustomValidity('') // Restablecer el mensaje de error

    // Establecer validaciones según la unidad seleccionada
    if (unidad === 'litro' || unidad === 'kilogramo') {
      cantidadInput.setAttribute('pattern', '^(\\d+|\\d+\\.5)$') // Solo permite enteros o medios
      cantidadInput.setAttribute('title', 'Por favor, ingresa un número válido (entero o medio).') // Mensaje de ayuda

      // Validar el valor actual del input
      if (!cantidadInput.value.match(/^(\\d+|\\d+\\.5)$/)) {
        cantidadInput.setCustomValidity('Por favor, ingresa un número válido (entero o medio).')
      }
    } else {
      cantidadInput.removeAttribute('pattern') // Permitir cualquier número
      cantidadInput.setCustomValidity('') // Restablecer el mensaje de error
    }
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
    } else if (selectedText.substring(0, 4) === 'EPAJ') {
      empresaPertece = 'Lugar Agricola'
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
    const productos = []
    const productosSeleccionados = document.querySelectorAll('select[name="producto[]"]')
    const unidadesMedida = document.querySelectorAll('select[name="unidad_medida[]"]')
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]')

    productosSeleccionados.forEach((producto, index) => {
      console.log(producto.value)
      productos.push({
        id_producto: producto.value,
        unidad_medida: unidadesMedida[index].value,
        cantidad: parseFloat(cantidades[index].value)
      })
    })

    return productos
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
    primerProducto.querySelector('.select-producto').selectedIndex = 0
    primerProducto.querySelector('.select-unidad-medida').innerHTML = ''
    primerProducto.querySelector('.select-unidad-medida').disabled = true
    primerProducto.querySelector('input[name="cantidad[]"]').value = ''
  }

  mostrarExito (mensaje) {
    console.log(mensaje)
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl: '/protected/admin'
    })
  }

  mostrarError (mensaje) {
    console.log(mensaje)
    mostrarMensaje({
      msg: mensaje,
      type: 'error',
      redirectUrl: null // No redirigir en caso de error
    })
  }

  manejarErrorReceta (error) {
    console.error('Error al guardar receta:', error)
    this.mostrarError(error.message || 'Ocurrió un error al guardar la receta')
  }

  navegarInicio = () => {
    window.location.href = '/protected/admin'
  }

  manejarCambioRancho = (evento) => {
    const rancho = evento.target.value
    this.ejecutarSeguros(() => centrosCoste(rancho))
  }

  manejarCambioCentroCoste = (evento) => {
    const id = evento.target.value
    this.ejecutarSeguros(() => Variedades(id))
  }

  manejarCambioUnidadMedida = (evento) => {
    const unidadMedida = evento.target.value
    this.validacionCantidad(unidadMedida)
  }

  ejecutarSeguros (callback) {
    try {
      callback()
    } catch (error) {
      this.manejarError(error)
    }
  }

  agregarNuevoProducto = async () => {
    try {
      // Obtener los productos
      const datos = await this.fetchProductos()

      // Crear nuevo campo de producto
      const nuevoCampo = this.crearCampoProducto(datos)

      // Agregar al contenedor
      this.elementos.productosContainer.appendChild(nuevoCampo)

      // Configurar evento de cambio para el nuevo select de producto
      const nuevoSelectProducto = nuevoCampo.querySelector('.select-producto')
      nuevoSelectProducto.addEventListener('change', this.handleCambioProducto)
    } catch (error) {
      this.manejarError(error)
    }
  }

  crearCampoProducto (datos) {
    const nuevoItem = document.createElement('div')
    nuevoItem.classList.add('producto-item')

    // Crear select de producto
    const selectProducto = document.createElement('select')
    selectProducto.name = 'producto[]'
    selectProducto.classList.add('formulario__input', 'select-producto')
    selectProducto.required = true

    // Crear select de unidad de medida
    const selectUnidadMedida = document.createElement('select')
    selectUnidadMedida.name = 'unidad_medida[]'
    selectUnidadMedida.classList.add('formulario__input', 'select-unidad-medida')
    selectUnidadMedida.required = true
    selectUnidadMedida.disabled = true // Inicialmente deshabilitado

    // Opción por defecto para producto
    const optionDefaultProducto = document.createElement('option')
    optionDefaultProducto.value = ''
    optionDefaultProducto.textContent = 'Seleccionar Producto'
    selectProducto.appendChild(optionDefaultProducto)

    // Añadir productos al select
    datos.forEach(producto => {
      const option = document.createElement('option')
      option.value = producto.id_producto
      option.textContent = producto.nombre
      option.dataset.unidadBase = producto.unidad_medida
      selectProducto.appendChild(option)
    })

    // Crear estructura HTML del nuevo campo
    nuevoItem.innerHTML = `
          ${selectProducto.outerHTML}
          ${selectUnidadMedida.outerHTML}
          <input
            class="formulario__input" 
            type="number" 
            name="cantidad[]" 
            placeholder="Cantidad" 
            min="0" 
            step="0.01" 
            required
          >
        <div class="acciones-producto">
          <button type="button" class="eliminar-producto formulario__submit btn-eliminar">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
    `
    // Obtener referencias a los elementos creados
    // Añadir evento de cambio para el select de producto
    selectProducto.addEventListener('change', (evento) => {
      const selectedOption = evento.target.options[evento.target.selectedIndex]
      const unidadBase = selectedOption.dataset.unidadBase

      // Habilitar el select de unidad de medida y establecer las opciones
      selectUnidadMedida.disabled = false
      selectUnidadMedida.innerHTML = '' // Limpiar opciones anteriores

      // Agregar opciones de unidad de medida basadas en la unidad base del producto
      if (unidadBase) {
        const option = document.createElement('option')
        option.value = unidadBase
        option.textContent = unidadBase.charAt(0).toUpperCase() + unidadBase.slice(1)
        selectUnidadMedida.appendChild(option)
      }

      // Llamar a la validación de cantidad
      this.validacionCantidad(selectUnidadMedida)
    })

    // Añadir evento de cambio para el select de unidad de medida
    selectUnidadMedida.addEventListener('change', (evento) => {
      this.validacionCantidad(evento.target) // Llamar a la validación de cantidad
    })

    // Añadir evento de cambio para el select de producto
    const botonEliminar = nuevoItem.querySelector('.eliminar-producto')
    botonEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.producto-item')
      if (productosActuales.length > 1) {
        nuevoItem.remove()
      } else {
        this.mostrarError('Debe haber al menos un producto')
      }
    })

    return nuevoItem
  }

  handleCambioProducto = (event) => {
    // Encontrar el contenedor del producto
    const contenedorProducto = event.target.closest('.producto-item')

    // Encontrar el select de unidad de medida
    const selectUnidadMedida = contenedorProducto.querySelector('.select-unidad-medida')

    // Limpiar select de unidad de medida
    selectUnidadMedida.innerHTML = ''
    selectUnidadMedida.disabled = false

    // Obtener el producto seleccionado
    const productoSeleccionado = event.target.options[event.target.selectedIndex]

    // Si se ha seleccionado un producto
    if (productoSeleccionado.value) {
      // Obtener la unidad base del producto
      const unidadBase = productoSeleccionado.dataset.unidadBase

      // Generar unidades
      const unidades = this.generarUnidades(unidadBase)

      // Añadir opción por defecto
      const optionDefault = document.createElement('option')
      optionDefault.value = ''
      optionDefault.textContent = 'Seleccionar Unidad'
      selectUnidadMedida.appendChild(optionDefault)

      // Añadir unidades
      unidades.forEach(unidad => {
        const option = document.createElement('option')
        option.value = unidad.toLowerCase()
        option.textContent = unidad
        selectUnidadMedida.appendChild(option)
      })
    } else {
      // Si no hay producto seleccionado, deshabilitar select de unidad
      selectUnidadMedida.disabled = true
    }
  }

  generarUnidades (unidadBase) {
    const unidadesMap = {
      litro: ['Litro', 'Mililitro'],
      kilogramo: ['Kilogramo', 'Gramo']
    }
    const unidadNormalizada = unidadBase.toLowerCase().trim()
    return unidadesMap[unidadNormalizada] || [unidadBase]
  }
}

// Inicializar la clase cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())

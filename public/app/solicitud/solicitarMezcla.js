/* eslint-disable no-undef */
import { centrosCoste, Variedades, cambioSolicitud } from '../CentrosCoste.js'
import { mostrarMensaje } from '../mensajes.js'
import { showSpinner, hideSpinner } from '../spinner.js'
class SolicitudFormulario {
  constructor () {
    this.productosData = [] // Variable para almacenar productos
    this.initElements()
    this.bindEvents()
    this.iniciarTipoSolicitud()
  }

  initElements () {
    this.elementos = {
      regresar: document.getElementById('regresar'),
      rancho: document.querySelector('#rancho'),
      centroCoste: document.querySelector('#centroCoste'),
      variedad: document.querySelector('#variedad'),
      unidadMedida: document.querySelector('select[name="unidad_medida[]"]'), // Asegúrate de que este selector sea correcto
      productosContainer: document.getElementById('productosContainer'),
      agregarProductoBtn: document.getElementById('agregarProducto'),
      recetaForm: document.getElementById('recetaForm'),
      porcetajeForm: document.getElementById('formPorcentaje')
    }
  }

  bindEvents () {
    this.elementos.regresar.addEventListener('click', this.navegarInicio)
    this.elementos.rancho.addEventListener('change', this.manejarCambioRancho)
    this.elementos.centroCoste.addEventListener('change', this.manejarCambioCentroCoste)
    this.elementos.variedad.addEventListener('change', this.manejarCambioVariedad)
    // Verifica que this.elementos.unidadMedida sea un elemento válido
    if (this.elementos.unidadMedida) {
      this.elementos.unidadMedida.addEventListener('change', this.manejarCambioUnidadMedida)
    }
    //
    this.elementos.recetaForm.addEventListener('submit', this.manejarEnvioReceta.bind(this))
    this.elementos.porcetajeForm.addEventListener('submit', this.manejarEnvioPorcentajes.bind(this))
    this.elementos.agregarProductoBtn.addEventListener('click', this.agregarNuevoProducto)
  }

  iniciarSelect2 () {
    try {
      if (typeof jQuery === 'undefined') {
        console.error('jQuery no está cargado')
        return
      }
      if (typeof jQuery.fn.select2 === 'undefined') {
        console.error('Select2 no está cargado')
        return
      }

      // Inicializar Select2 con configuración
      $('.select-producto').select2({
        placeholder: 'Seleccionar Producto',
        allowClear: true
      }).on('select2:select', (e) => {
        // Obtener el elemento select nativo
        const selectNativo = e.target
        // Disparar el evento change nativo
        const event = new Event('change', { bubbles: true })
        selectNativo.dispatchEvent(event)
      })
    } catch (error) {
      console.error('Error al inicializar Select2:', error)
    }
  }

  // Agregar el método destruirSelect2
  destruirSelect2 (elemento) {
    try {
      $(elemento).select2('destroy')
    } catch (error) {
      console.error('Error al destruir Select2:', error)
    }
  }

  // iniciar tipo de solicitud fertilizante o mezcla
  async iniciarTipoSolicitud () {
    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          Mezcla: 'Mezcla',
          Fertilizantes: 'Fertilizantes'
        })
      }, 500)
    })

    const result = await Swal.fire({
      title: 'Seleciona el tipo de solicitud',
      input: 'radio',
      inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe seleccionar una opcionar el tipo de solicitud'
        }
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Continuar'
    })

    // Si se hace clic en cancelar, redirigir a admin
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.location.href = '/protected/admin'
      return
    }

    // Si se seleccionó un tipo, procesar la selección
    if (result.value) {
      const tipo = result.value
      const titulo = document.getElementById('titulo')
      const campofolio = document.getElementById('campoFolio')
      const campoCantidad = document.getElementById('campoCantidad')
      const campoPresentacion = document.getElementById('campoUnidad')

      await Swal.fire({ html: `Seleccionastes: ${tipo}` })

      if (tipo === 'Mezcla') {
        titulo.innerHTML = 'Solicitud de Mezcla'
        campofolio.style.display = 'block'
        campoCantidad.style.display = 'block'
        campoPresentacion.style.display = 'block'
        folio.disabled = false
        folio.required = true
        cantidad.disabled = false
        cantidad.required = true
        presentacion.disabled = false
        presentacion.required = true
      } else if (tipo === 'Fertilizantes') {
        titulo.innerHTML = 'Solicitud de Fertilizantes'
        campofolio.style.display = 'none'
        campoCantidad.style.display = 'none'
        campoPresentacion.style.display = 'none'
        folio.disabled = true
        folio.required = false
        folio.value = ''
        cantidad.disabled = true
        cantidad.required = false
        cantidad.value = ''
        presentacion.disabled = true
        presentacion.required = false
        presentacion.value = ''
      }
    }
  }

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
      'rancho', 'centroCoste', 'variedad',
      'temporada', 'metodoAplicacion'
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
    const productos = document.querySelectorAll('.select-producto')
    const unidadesMedida = document.querySelectorAll('select[name="unidad_medida[]"]')
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]')

    const productosUnicos = new Set()

    const errores = []

    productos.forEach((productoSelect, index) => {
      // Obtener el valor del select
      const selectedOption = productoSelect.options[productoSelect.selectedIndex]
      const producto = selectedOption ? selectedOption.value : ''
      const unidad = unidadesMedida[index].value
      const cantidad = cantidades[index].value

      if (!producto) {
        errores.push('Debe seleccionar un producto')
        productoSelect.classList.add('input-error')
        // Agregar clase de error al contenedor de Select2
        $(productoSelect).next('.select2-container').addClass('input-error')
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
          $(productoSelect).next('.select2-container').addClass('input-error')
        } else {
          productosUnicos.add(producto)
        }
      }
    })

    // Limpiar errores previos
    document.querySelectorAll('.input-error').forEach(element => {
      element.classList.remove('input-error')
    })
    $('.select2-container.input-error').removeClass('input-error')

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

  validadPorcentajes () {
    const porcentajes = document.querySelectorAll('input[name="porcentaje[]"]')
    const errores = []
    let sumaTotal = 0

    // Validar cada campo de porcentaje
    porcentajes.forEach((input, index) => {
      const valor = parseFloat(input.value)

      // Validar que el campo no esté vacío
      if (!input.value.trim()) {
        errores.push(`El porcentaje ${index + 1} es requerido`)
        return
      }

      // Validar que sea un número válido
      if (isNaN(valor)) {
        errores.push(`El porcentaje ${index + 1} debe ser un número`)
        return
      }

      // Validar rango del porcentaje (0-100)
      if (valor < 0 || valor > 100) {
        errores.push(`El porcentaje ${index + 1} debe estar entre 0 y 100`)
        return
      }

      // Sumar al total
      sumaTotal += valor
    })

    // Validar que la suma sea 100%
    if (Math.abs(sumaTotal - 100) > 0.01) {
      errores.push(`La suma de los porcentajes debe ser 100%. Suma actual: ${sumaTotal}%`)
    }

    // Mostrar errores si existen
    if (errores.length > 0) {
      const erroresUnicos = [...new Set(errores)]
      this.mostrarError(erroresUnicos.join('\n'))
      return false
    }
    return true
  }

  // Métodos para enviar formulario
  manejarEnvioReceta = async (e) => {
    e.preventDefault()
    showSpinner()
    try {
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

      // Envío de datos al servidor
      const respuesta = await this.enviarReceta(datosReceta)

      // Procesar respuesta
      this.procesarRespuestaReceta(respuesta)
    } catch (error) {
      hideSpinner()
      this.manejarErrorReceta(error)
    } finally {
      hideSpinner()
    }
  }

  manejarEnvioPorcentajes = async (e) => {
    e.preventDefault()
    showSpinner()
    try {
      // Validación de porcentajes
      if (!this.validadPorcentajes()) {
        return
      }

      // Recopilación de datos
      const datosPorcentaje = this.recopilarDatosPorcentaje()

      // Envío de datos al servidor
      const respuesta = await this.enviarPorcentaje(datosPorcentaje)

      // Procesar respuesta exitosa
      this.procesarRespuestaPorcentajes(respuesta)
    } catch (error) {
      hideSpinner()
      console.error('Error en manejarEnvioPorcentajes:', error)
      this.mostrarError(error.message || 'Error al guardar los porcentajes')
    } finally {
      hideSpinner()
    }
  }

  // Métodos de procesamiento de datos
  recopilarDatosReceta () {
    // OBTENEMOS DATOS DEL CENTRO DE COTE PARA SABER LA EMPRESA A LA QUE PERTENECE
    const centroCosteSelect = document.getElementById('centroCoste')
    const selectedIndex = centroCosteSelect.selectedIndex
    const selectedOption = centroCosteSelect.options[selectedIndex]
    const selectedText = selectedOption.text.trim()
    let empresaPertece = ''

    if (selectedText.substring(0, 3) === 'MFI') {
      empresaPertece = 'Moras Finas'
    } else if (selectedText.substring(0, 3) === 'BCE') {
      empresaPertece = 'Bayas del Centro'
    } else if (selectedText.substring(0, 3) === 'BIO') {
      empresaPertece = 'Bioagricultura'
    } else if (selectedText.substring(0, 3) === 'EPA') {
      empresaPertece = 'Lugar Agricola'
    }
    const receta = {
      rancho: document.getElementById('rancho').value.trim(),
      centroCoste: document.getElementById('centroCoste').value.trim(),
      variedad: document.getElementById('variedad').value.trim(),
      folio: document.getElementById('folio').value.trim(),
      temporada: document.getElementById('temporada').value.trim(),
      cantidad: document.getElementById('cantidad').value.trim(),
      presentacion: document.getElementById('presentacion').value.trim(),
      metodoAplicacion: document.getElementById('metodoAplicacion').value.trim(),
      descripcion: document.getElementById('descripcion').value.trim(),
      productos: this.recopilarProductos(),
      empresaPertece
    }

    return receta
  }

  recopilarProductos () {
    const productos = []
    const productosItems = document.querySelectorAll('.producto-item')

    productosItems.forEach(item => {
      // Obtener elementos del item
      const select = item.querySelector('.select-producto')
      const selectUnidadMedida = item.querySelector('select[name="unidad_medida[]"]')
      const inputCantidad = item.querySelector('input[name="cantidad[]"]')

      if (select && selectUnidadMedida && inputCantidad) {
        // Obtener la opción seleccionada del select
        const selectedOption = select.options[select.selectedIndex]

        if (selectedOption && (selectedOption.dataset.idProducto || selectedOption.dataset.idReceta)) {
          productos.push({
            id_producto: selectedOption.dataset.idProducto || selectedOption.dataset.idReceta,
            unidad_medida: selectUnidadMedida.value,
            cantidad: parseFloat(inputCantidad.value)
          })
        }
      }
    })
    console.log('Productos recopilados:', productos) // Debug

    return productos
  }

  recopilarDatosPorcentaje () {
    try {
      const centroCoste = document.getElementById('centroCoste').value
      const porcentajes = []
      const porcentajeItems = document.querySelectorAll('input[name="porcentaje[]"]')

      // Asegurarse de que todos los valores sean números
      porcentajeItems.forEach(item => {
        const valor = parseFloat(item.value) || 0
        porcentajes.push(valor)
      })

      // Validar que haya datos
      if (porcentajes.length === 0) {
        throw new Error('No hay porcentajes para enviar')
      }

      // AGREGAMOS UN PÓRCENTAJE EXTRA PARA EL CENTRO DE COSTA
      porcentajes.push(0)

      // Crear el objeto de datos
      const data = {
        porcentajes: porcentajes.join(','), // Convertir array a string
        centroCoste: parseInt(centroCoste)
      }

      console.log('Datos a enviar:', data) // Debug
      return data
    } catch (error) {
      console.error('Error en recopilarDatosPorcentaje:', error)
      throw error
    }
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

  enviarPorcentaje = async (datosPorcentaje) => {
    try {
      // Validar datos antes de enviar
      if (!datosPorcentaje.centroCoste) {
        throw new Error('Centro de coste no válido')
      }

      if (!datosPorcentaje.porcentajes) {
        throw new Error('No hay porcentajes para enviar')
      }

      const respuesta = await fetch('/api/porcentajeVariedad/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPorcentaje)
      })

      if (!respuesta.ok) {
        const errorDetallado = await respuesta.json()
        throw new Error(errorDetallado.message || 'Error al guardar los porcentajes')
      }

      const resultado = await respuesta.json()
      console.log('Respuesta del servidor:', resultado) // Debug
      return resultado
    } catch (error) {
      console.error('Error en enviarPorcentaje:', error)
      throw error
    }
  }

  // Métodos de respuesta
  procesarRespuestaReceta (respuesta) {
    // Resetear formulario
    this.elementos.recetaForm.reset()

    // Reiniciar campos de productos
    this.reiniciarCamposProductos()

    // Mostrar mensaje de éxito
    this.mostrarExito(respuesta.message || 'Receta guardada exitosamente', '/protected/admin')
  }

  // Agregar método para procesar respuesta de porcentajes
  procesarRespuestaPorcentajes (respuesta) {
  // Cerrar el modal si existe
    const modal = document.querySelector('#ModalEditar')
    if (modal) {
      $(modal).modal('hide')
    }

    // Mostrar mensaje de éxito
    this.mostrarExito(respuesta.message || 'Porcentajes actualizados correctamente')
  }

  // Métodos de UI
  reiniciarCamposProductos () {
    const productosContainer = this.elementos.productosContainer
    const productosActuales = productosContainer.querySelectorAll('.producto-item')

    // Mantener solo el primer campo, eliminar el resto
    for (let i = 1; i < productosActuales.length; i++) {
      const selectToDestroy = productosActuales[i].querySelector('.select-producto')
      if (selectToDestroy) {
        this.destruirSelect2(selectToDestroy)
      }
      productosActuales[i].remove()
    }

    // Resetear selects y inputs del primer campo
    const primerProducto = productosActuales[0]
    primerProducto.querySelector('.select-producto').selectedIndex = 0
    primerProducto.querySelector('.select-unidad-medida').innerHTML = ''
    primerProducto.querySelector('.select-unidad-medida').disabled = true
    primerProducto.querySelector('input[name="cantidad[]"]').value = ''
  }

  mostrarExito (mensaje, redirectUrl) {
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl
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

  manejarCambioVariedad = (evento) => {
    const selecion = evento.target.value
    // obtener el valor de la variedad y porcentaje de dataset
    const variedad = evento.target.dataset.variedad
    const porcentaje = evento.target.dataset.porcentajes
    this.ejecutarSeguros(() => cambioSolicitud({ selecion, variedad, porcentaje }))
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

      this.iniciarSelect2()
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

    // Crear contenedor para el select
    const contenedorSelect = document.createElement('div')
    contenedorSelect.classList.add('select-container')

    // Crear select para productos
    const select = document.createElement('select')
    select.name = 'producto[]'
    select.classList.add('select-producto', 'formulario__input')
    select.required = true

    // Opción por defecto
    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Seleccionar producto'
    select.appendChild(defaultOption)

    // Agregar productos al select
    if (datos.productos && datos.productos.length > 0) {
      const groupProductos = document.createElement('optgroup')
      groupProductos.label = 'Productos'

      datos.productos.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.nombre
        option.textContent = producto.nombre
        option.dataset.unidadBase = producto.unidad_medida
        option.dataset.idProducto = producto.id_producto
        groupProductos.appendChild(option)
      })

      select.appendChild(groupProductos)
    }

    // Agregar recetas al select si existen
    // if (datos.recetas && datos.recetas.length > 0) {
    //   const groupRecetas = document.createElement('optgroup')
    //   groupRecetas.label = 'Recetas'

    //   datos.recetas.forEach(receta => {
    //     const option = document.createElement('option')
    //     option.value = receta.nombre
    //     option.textContent = receta.nombre
    //     option.dataset.unidadBase = receta.unidad_medida
    //     option.dataset.idReceta = receta.id_receta
    //     groupRecetas.appendChild(option)
    //   })

    //   select.appendChild(groupRecetas)
    // }

    // Crear select de unidad de medida
    const selectUnidadMedida = document.createElement('select')
    selectUnidadMedida.name = 'unidad_medida[]'
    selectUnidadMedida.classList.add('formulario__input', 'select-unidad-medida')
    selectUnidadMedida.required = true
    selectUnidadMedida.disabled = true
    selectUnidadMedida.innerHTML = '<option value="">Unidad de Medida</option>'

    // Crear campo de cantidad
    const inputCantidad = document.createElement('input')
    inputCantidad.classList.add('formulario__input')
    inputCantidad.type = 'number'
    inputCantidad.name = 'cantidad[]'
    inputCantidad.placeholder = 'Cantidad'
    inputCantidad.min = '0'
    inputCantidad.step = '0.01'
    inputCantidad.required = true

    // Crear botón de eliminar
    const botonEliminar = document.createElement('button')
    botonEliminar.type = 'button'
    botonEliminar.classList.add('eliminar-producto', 'formulario__submit')
    botonEliminar.innerHTML = '<i class="fas fa-trash"></i> Eliminar'

    // Agregar elementos al contenedor
    contenedorSelect.appendChild(select)
    nuevoItem.appendChild(contenedorSelect)
    nuevoItem.appendChild(selectUnidadMedida)
    nuevoItem.appendChild(inputCantidad)
    nuevoItem.appendChild(botonEliminar)

    // Después de agregar el nuevo campo al DOM
    $(select).select2({
      placeholder: 'Seleccionar Producto',
      allowClear: true
    }).on('select2:select', (e) => {
      const event = new Event('change', { bubbles: true })
      e.target.dispatchEvent(event)
    })
    // Manejar evento de cambio del select
    select.addEventListener('change', this.handleCambioProducto.bind(this))

    // Configurar evento de eliminación
    botonEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.producto-item')
      if (productosActuales.length > 1) {
        // Destruir Select2 antes de eliminar el elemento
        const selectToDestroy = nuevoItem.querySelector('.select-producto')
        if (selectToDestroy) {
          this.destruirSelect2(selectToDestroy)
        }
        nuevoItem.remove()
      } else {
        this.mostrarError('Debe haber al menos un producto')
      }
    })

    return nuevoItem
  }

  handleCambioProducto = (event) => {
    console.log('Evento change disparado')

    // Encontrar el contenedor del producto
    const contenedorProducto = event.target.closest('.producto-item')
    if (!contenedorProducto) {
      console.error('No se encontró el contenedor del producto')
      return
    }

    // Encontrar el select de unidad de medida
    const selectUnidadMedida = contenedorProducto.querySelector('.select-unidad-medida')
    if (!selectUnidadMedida) {
      console.error('No se encontró el select de unidad de medida')
      return
    }

    // Limpiar select de unidad de medida
    selectUnidadMedida.innerHTML = ''
    selectUnidadMedida.disabled = false

    // Obtener el producto seleccionado
    const productoSeleccionado = event.target.options[event.target.selectedIndex]
    console.log('Producto seleccionado:', productoSeleccionado)

    // Si se ha seleccionado un producto
    if (productoSeleccionado.value) {
      // Obtener la unidad base del producto
      const unidadBase = productoSeleccionado.dataset.unidadBase
      console.log('Unidad base:', unidadBase)

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
    if (!unidadBase) return []
    // Mapa de unidades equivalentes para litro y kilogramo
    const unidadesMap = {
      litro: ['Litro', 'Mililitro'],
      kilogramo: ['Kilogramo', 'Gramo'],
      Unidad: ['Unidad']
    }
    const unidadNormalizada = unidadBase.toLowerCase().trim()
    return unidadesMap[unidadNormalizada] || [unidadBase]
  }
}

// Inicializar la clase cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())

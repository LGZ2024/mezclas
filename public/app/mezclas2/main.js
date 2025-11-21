/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'
import { showSpinner, hideSpinner } from '../spinner.js'

// Función para capitalizar la primera letra de cada palabra
const capitalizarPalabras = (str) => {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

document.addEventListener('DOMContentLoaded', () => {
  let tipo = ''
  // Función para aplicar capitalización a un formulario
  const aplicarCapitalizacion = (form) => {
    if (!form) return
    const inputsTexto = form.querySelectorAll('input[type="text"]')
    inputsTexto.forEach(input => {
      input.addEventListener('input', (e) => {
        const valor = e.target.value
        if (valor !== valor.toUpperCase()) { // No capitalizar si está en mayúsculas
          e.target.value = capitalizarPalabras(valor)
        }
      })
    })
  }
  // cachear referencia DOM
  const elementos = {
    BtnRegresar: document.getElementById('regresar'),
    BtnNewProducto: document.getElementById('agregarProducto'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    tipoAplicacion: document.querySelector('#TipoAplicacion'),
    rancho: document.querySelector('#rancho'),
    centroCoste: document.querySelector('#centroCoste'),
    variedad: document.querySelector('#variedad'),
    unidadMedida: document.querySelector('select[name="unidad_medida[]"]'), // Asegúrate de que este selector sea correcto
    productosContainer: document.getElementById('productosContainer'),
    FormSolicitud: document.getElementById('recetaForm'),
    FormPorcentaje: document.getElementById('formPorcentaje')
  }

  // Función para actualizar UI de forma optimizada
  const actualizarUI = (callback) => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(async () => {
        const resultado = await callback() // 🟢 ahora sí lo esperas
        resolve(resultado) // 🟢 y lo devuelves
      })
    })
  }

  // funcion para llenar los selects de centro de coste
  const setPostCentroCoste = (data) => {
    const centroCoste = document.getElementById('centroCoste')
    centroCoste.innerHTML = ''
    if (data.length) {
      centroCoste.append(new Option('Selecciona Centro de Coste', ''))
      data.forEach(doc => { // con esta funcion recorrecmos los documentos traidos desde firebase
        centroCoste.append(new Option(doc.centroCoste, doc.id))
      })
    } else {
      centroCoste.append(new Option('Error al cargar los datos', 0))
    }
  }

  const setPostVariedad = (data) => {
    const variedades = document.getElementById('variedad')
    variedades.innerHTML = ''
    if (data.length) {
      variedades.append(new Option('Seleccione una variedad', ''))

      // Definir la cadena de datos
      const variedad = data[0].variedad
      const porcentajes = data[0].porcentajes

      // agrgamos dataset a option para todas las variedades
      variedades.dataset.variedad = variedad
      variedades.dataset.porcentajes = porcentajes

      // Separar los elementos de la variedad en un array
      const elementos = variedad.split(',')

      // Recorrer el array e imprimir cada elemento
      elementos.forEach(function (elemento) {
        variedades.append(new Option(elemento, elemento))
      })
      variedades.append(new Option('Todas las variedades', 'todo'))
    } else {
      variedades.append(new Option('Error al cargar los datos', 0))
    }
  }
  const setPostAplicacion = (data) => {
    const aplicacion = document.getElementById('aplicacion')
    aplicacion.innerHTML = ''

    // Convertir a array si no lo es
    const dataArray = Array.isArray(data) ? data : (data ? [data] : [])

    if (dataArray.length > 0) {
      aplicacion.append(new Option('Selecciona Aplicacion', ''))
      dataArray.forEach(doc => {
        aplicacion.append(new Option(doc.aplicacion, doc.id))
      })
    } else {
      aplicacion.append(new Option('Error al cargar los datos', 0))
    }
  }
  // Helper para obtener el botón submit con fallbacks seguros.
  // Usa e.submitter si está disponible (botón que disparó el submit),
  // luego busca dentro del form, después por ID fallback y finalmente el botón global.
  const obtenerSubmitBtn = (e, fallbackId = null) => {
    try {
      if (e && e.submitter) return e.submitter
    } catch (err) {
      // some browsers may throw, sigue con fallbacks
    }
    if (e && e.target) {
      const btnDentro = e.target.querySelector('button[type="submit"]')
      if (btnDentro) return btnDentro
    }
    if (fallbackId) {
      const byId = document.getElementById(fallbackId)
      if (byId) return byId
    }
    return elementos.btnRegistrar || null
  }
  // Validad Campos
  const validarFormulario = async (camposRequeridos) => {
    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      // Si el elemento no existe, considerarlo inválido para forzar el mensaje
      if (!elemento) return true
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      await actualizarUI(() => {
        mostrarError(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`)
        // Reactivar botón global de registro si existe
        if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        hideSpinner()
      })
      return false
    }

    return true
  }

  const validarProductos = () => {
    const productos = document.querySelectorAll('.select-producto')
    const unidadesMedida = document.querySelectorAll('select[name="unidad_medida[]"]')
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]')

    const productosUnicos = new Set()

    const errores = []

    if (!productos || !unidadesMedida || !cantidades) {
      this.mostrarError('Agregar almenos un producto')
    }
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

  const validacionCantidad = (unidad) => {
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

  const validarPorcentajes = () => {
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

  // Agregar el método iniciarSelect2
  const iniciarSelect2 = () => {
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

  const destruirSelect2 = (elemento) => {
    try {
      $(elemento).select2('destroy')
    } catch (error) {
      console.error('Error al destruir Select2:', error)
    }
  }

  // iniciar tipo de solicitud fertilizante o mezcla
  const iniciarTipoSolicitud = async () => {
    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          Mezcla: 'Mezcla',
          Fertilizantes: 'Fertilizantes',
          Devoluciones: 'Devoluciones'
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
      tipo = result.value
      const titulo = document.getElementById('titulo')
      const campofolio = document.getElementById('campoFolio')
      const campoCantidad = document.getElementById('campoCantidad')
      const campoPresentacion = document.getElementById('campoUnidad')
      const campoRancho = document.getElementById('campoRancho')
      const campoCentro = document.getElementById('campoCentro')
      const campoAlmacen = document.getElementById('campoAlmacen')
      const campoVariedad = document.getElementById('campoVariedad')
      const campoUnidad = document.getElementById('campoUnidad')
      const campoDescripcion = document.getElementById('campoDescripcion')
      const campoMetodo = document.getElementById('campoMetodo')
      const campoTipoAplicacion = document.getElementById('campoTipoAplicacion')
      const campoAplicacion = document.getElementById('campoAplicacion')
      const campoFechaAplicacion = document.getElementById('campoFechaAplicacion')

      await Swal.fire({ html: `Seleccionastes: ${tipo}` })

      if (tipo === 'Mezcla') {
        titulo.innerHTML = 'Solicitud de Mezcla'

        campoAlmacen.style.display = 'none'

        campofolio.disabled = true

        campoAlmacen.required = false
        campoDescripcion.required = false
      } else if (tipo === 'Fertilizantes') {
        titulo.innerHTML = 'Solicitud de Fertilizantes'

        campofolio.style.display = 'none'
        campoCantidad.style.display = 'none'
        campoPresentacion.style.display = 'none'
        campoAlmacen.style.display = 'none'

        campofolio.disabled = true
        campoCantidad.disabled = true
        campoPresentacion.disabled = true
        campofolio.disabled = true

        campofolio.required = false
        campoCantidad.required = false
        campoPresentacion.required = false
        campoAlmacen.required = false
        campoDescripcion.required = false

        campofolio.value = ''
        campoCantidad.value = ''
        campoPresentacion.value = ''
        campoAlmacen.value = ''
      } else if (tipo === 'Devoluciones') {
        titulo.innerHTML = 'Solicitud de Devolucion'

        campofolio.style.display = 'none'
        campoCantidad.style.display = 'none'
        campoPresentacion.style.display = 'none'
        campoRancho.style.display = 'none'
        campoCentro.style.display = 'none'
        campoVariedad.style.display = 'none'
        campoUnidad.style.display = 'none'
        campoMetodo.style.display = 'none'
        campoTipoAplicacion.style.display = 'none'
        campoAplicacion.style.display = 'none'
        campoFechaAplicacion.style.display = 'none'

        campofolio.disabled = true
        campoCantidad.disabled = true
        campoPresentacion.disabled = true
        campoRancho.disabled = true
        campoCentro.disabled = true
        campoVariedad.disabled = true
        campoUnidad.disabled = true
        campoMetodo.disabled = true
        campoTipoAplicacion.disabled = true
        campoAplicacion.disabled = true
        campoFechaAplicacion.disabled = true

        campofolio.required = false
        campoCantidad.required = false
        campoPresentacion.required = false
        campoRancho.required = false
        campoCentro.required = false
        campoVariedad.required = false
        campoUnidad.required = false
        campoMetodo.required = false
        campoTipoAplicacion.required = false
        campoAplicacion.required = false
        campoFechaAplicacion.required = false
      }
    }
  }

  // Métodos de procesamiento de datos
  const recopilarDatosReceta = async () => {
    let receta
    let url = ''
    if (tipo === 'Fertilizantes' || tipo === 'Mezcla') {
      url = '/api/solicitudes'
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
      receta = {
        tipo,
        rancho: document.getElementById('rancho').value.trim(),
        centroCoste: document.getElementById('centroCoste').value.trim(),
        variedad: document.getElementById('variedad').value.trim(),
        folio: document.getElementById('folio').value.trim(),
        temporada: document.getElementById('temporada').value.trim(),
        cantidad: document.getElementById('cantidad').value.trim(),
        presentacion: document.getElementById('presentacion').value.trim(),
        metodoAplicacion: document.getElementById('metodoAplicacion').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        productos: recopilarProductos(),
        empresaPertece,
        fechaAplicacion: document.getElementById('fechaAplicacion').value.trim(),
        idTipoAplicacion: document.getElementById('TipoAplicacion').value.trim(),
        idAplicacion: document.getElementById('aplicacion').value.trim()
      }
    } else if (tipo === 'Devoluciones') {
      url = '/api/devoluciones'
      receta = {
        almacen: document.getElementById('almacen').value.trim(),
        temporada: document.getElementById('temporada').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        productos: recopilarProductos()
      }
    }
    return { url, receta }
  }

  const recopilarProductos = () => {
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

  const recopilarDatosPorcentaje = () => {
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
  // Métodos de respuesta
  const mostrarError = (mensaje) => {
    mostrarMensaje({
      msg: mensaje,
      type: 'error',
      redirectUrl: null // No redirigir en caso de error
    })
  }
  const mostrarExito = (mensaje, redirectUrl) => {
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl
    })
  }
  // resolver respuestas fech y mostrar mensajes
  const fetchApi = async (url, method, data) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return response
    } catch (error) {
      console.error('Error:', error.message)
    }
  }
  const respuestaFetch = async ({ respuesta, formularios, modal, button, redirectUrl }) => {
    const resultado = await actualizarUI(async () => {
      const res = mostrarExito(respuesta, redirectUrl)
      if (res === true) {
        hideSpinner()
        if (formularios) formularios.reset()
        // eslint-disable-next-line no-undef
        const modalReset = $(`#${modal}`)
        modalReset.modal('hide')
        button.disabled = false
      } else {
        hideSpinner()
        button.disabled = false
      }
      return res // Importante: retornar el resultado
    })
    return resultado // Importante: retornar el resultado final
  }

  // funcion para ejecutar callbacks con manejo de errores
  const ejecutarSeguros = (callback) => {
    try {
      callback()
    } catch (error) {
      mostrarError(error)
    }
  }

  // creacion de campos
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

  const crearCampoProducto = (datos) => {
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
    select.addEventListener('change', handlers.handleCambioProducto)

    // Configurar evento de eliminación
    botonEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.producto-item')
      if (productosActuales.length > 1) {
        // Destruir Select2 antes de eliminar el elemento
        const selectToDestroy = nuevoItem.querySelector('.select-producto')
        if (selectToDestroy) {
          destruirSelect2(selectToDestroy)
        }
        nuevoItem.remove()
      } else {
        mostrarError('Debe haber al menos un producto')
      }
    })

    return nuevoItem
  }

  const generarUnidades = (unidadBase) => {
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

  const reiniciarCamposProductos = () => {
    const productosContainer = elementos.productosContainer
    const productosActuales = productosContainer.querySelectorAll('.producto-item')

    // Mantener solo el primer campo, eliminar el resto
    for (let i = 1; i < productosActuales.length; i++) {
      const selectToDestroy = productosActuales[i].querySelector('.select-producto')
      if (selectToDestroy) {
        destruirSelect2(selectToDestroy)
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

  // delegacion de eventos
  const handlers = {
    handleRegresar () {
      requestAnimationFrame(() => {
        window.history.back()
      })
    },
    handleCentroCosteChange (evento) {
      const id = evento.target.value
      const url = `/api/variedades/${id}`
      const metod = 'GET'
      ejecutarSeguros(async () => {
        const response = await fetchApi(url, metod)
        const data = await response.json()
        setPostVariedad(data)
      })
    },
    handleRanchoChange (evento) {
      const rancho = evento.target.value
      const url = `/api/cc/${rancho}`
      const metod = 'GET'
      ejecutarSeguros(async () => {
        const response = await fetchApi(url, metod)
        const data = await response.json()
        setPostCentroCoste(data)
      })
    },
    handleTipoAplicacionChange (evento) {
      const selectedOption = evento.target.options[evento.target.selectedIndex]
      const id = selectedOption.dataset.id
      const url = `/api/catalogos/aplicaciones/${id}`
      const metod = 'GET'
      ejecutarSeguros(async () => {
        const response = await fetchApi(url, metod)
        const data = await response.json()
        setPostAplicacion(data)
      })
    },
    handleVariedadChange (evento) {
      const selecion = evento.target.value
      // obtener el valor de la variedad y porcentaje de dataset
      const variedad = evento.target.dataset.variedad
      const porcentaje = evento.target.dataset.porcentajes
      ejecutarSeguros(() => {
        // Validar y separar datos
        let variedades = variedad.split(',')
        let porcentajes = porcentaje.split(',')

        // Eliminar el último elemento de ambos arrays
        variedades = variedades.slice(0, -1)
        porcentajes = porcentajes.slice(0, -1)

        // validar que las longitudes coincidan
        if (variedades.length !== porcentajes.length) {
          return mostrarError('Los datos de variedades y porcentajes no coinciden.')
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
      })
    },
    handleUnidadMedidaChange (evento) {
      const unidadMedida = evento.target.value
      validacionCantidad(unidadMedida)
    },
    handleAgregarProductoClick (evento) {
      evento.preventDefault()
      ejecutarSeguros(async () => {
        try {
          // Obtener los productos
          const response = await fetchApi('/api/productos', 'GET')
          if (!response || !response.ok) {
            throw new Error('Error al obtener productos del servidor')
          }
          const data = await response.json()

          // Manejar tanto { productos: [...] } como [...]
          const productos = data.productos || data || []

          if (!productos || productos.length === 0) {
            mostrarError('No hay productos disponibles')
            return
          }

          // Crear nuevo campo de producto
          const nuevoCampo = crearCampoProducto({ productos })

          // Agregar al contenedor
          if (elementos.productosContainer) {
            elementos.productosContainer.appendChild(nuevoCampo)
          } else {
            console.error('Contenedor de productos no encontrado')
            return
          }

          iniciarSelect2()
          // Configurar evento de cambio para el nuevo select de producto
          const nuevoSelectProducto = nuevoCampo.querySelector('.select-producto')
          if (nuevoSelectProducto) {
            nuevoSelectProducto.addEventListener('change', handlers.handleCambioProducto)
          }
        } catch (error) {
          console.error('Error en handleAgregarProductoClick:', error)
          mostrarError(`Error al cargar productos: ${error.message}`)
          return []
        }
      })
    },
    handleCambioProducto (event) {
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
        const unidades = generarUnidades(unidadBase)

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
    },
    async handleSubmitReceta (event) {
      let camposRequeridos = []
      let submitButton = null
      try {
        event.preventDefault()
        showSpinner()
        // obtener el boton de submit
        submitButton = obtenerSubmitBtn(event)
        if (submitButton) submitButton.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true

        // Validar campos requeridos
        if (tipo === 'Mezcla') {
          camposRequeridos = [
            'rancho', 'centroCoste', 'variedad', 'folio',
            'temporada', 'presentacion', 'cantidad', 'metodoAplicacion',
            'TipoAplicacion', 'aplicacion', 'fechaAplicacion'
          ]
        } else if (tipo === 'Fertilizantes') {
          camposRequeridos = [
            'rancho', 'centroCoste', 'variedad',
            'temporada', 'metodoAplicacion', 'TipoAplicacion', 'aplicacion', 'fechaAplicacion'
          ]
        } else if (tipo === 'Devoluciones') {
          camposRequeridos = [
            'almacen', 'temporada', 'descripcion'
          ]
        }
        const esValido = await validarFormulario(camposRequeridos)
        if (!esValido) {
          if (submitButton) submitButton.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
          return
        }

        // Validar productos
        const productosValidos = validarProductos()
        if (!productosValidos) {
          if (submitButton) submitButton.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
          return
        }

        // Recopilar datos
        const { url, receta } = await recopilarDatosReceta()

        // Enviar datos al servidor
        const respuesta = await fetchApi(url, 'POST', receta)

        const res = await respuesta.json()

        // Manejar respuesta
        await respuestaFetch({
          respuesta: res.message,
          formularios: elementos.FormSolicitud,
          button: submitButton,
          redirectUrl: '/protected/admin'
        })

        reiniciarCamposProductos()
      } catch (error) {
        console.error('Error en handleSubmitReceta:', error)
        mostrarError(error.message || error)
        if (submitButton) submitButton.disabled = false
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        hideSpinner()
      } finally {
        hideSpinner()
        if (submitButton) submitButton.disabled = false
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
      }
    },
    async handleSubmitPorcentaje (event) {
      try {
        event.preventDefault()
        showSpinner()

        const submitButton = obtenerSubmitBtn(event)
        await actualizarUI(() => {
          if (submitButton) submitButton.disabled = true
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
        })

        // Validar campos requeridos
        if (validarPorcentajes) {
          return
        }
        // Recopilar datos
        const data = recopilarDatosPorcentaje()

        // Enviar datos al servidor
        const respuesta = await fetchApi('/api/porcentajes', 'POST', data)
        // Manejar respuesta
        await respuestaFetch({
          respuesta,
          formularios: elementos.porcetajeForm,
          modal: 'modalPorcentaje',
          button: submitButton
        })
      } catch (error) {
        mostrarError(error)
        submitButton.disabled = false
        hideSpinner()
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          if (submitButton) submitButton.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    }
  }

  // Función para inicializar un formulario con eventos
  const inicializarFormulario = (form, submitHandler) => {
    if (form) {
      form.addEventListener('submit', submitHandler)
      aplicarCapitalizacion(form)
    }
  }
  // Inicializar eventos
  // formularios
  inicializarFormulario(elementos.FormSolicitud, handlers.handleSubmitReceta)
  inicializarFormulario(elementos.porcetajeForm, handlers.handleSubmitPorcentaje)
  // botones y selects
  if (elementos.BtnRegresar) {
    elementos.BtnRegresar.addEventListener('click', handlers.handleRegresar)
  }
  if (elementos.BtnNewProducto) {
    elementos.BtnNewProducto.addEventListener('click', handlers.handleAgregarProductoClick)
  }

  if (elementos.centroCoste) {
    elementos.centroCoste.addEventListener('change', handlers.handleCentroCosteChange)
  }
  if (elementos.rancho) {
    elementos.rancho.addEventListener('change', handlers.handleRanchoChange)
  }
  if (elementos.variedad) {
    elementos.variedad.addEventListener('change', handlers.handleVariedadChange)
  }
  if (elementos.tipoAplicacion) {
    elementos.tipoAplicacion.addEventListener('change', handlers.handleTipoAplicacionChange)
  }
  if (elementos.unidadMedida) {
    elementos.unidadMedida.addEventListener('change', handlers.handleUnidadMedidaChange)
  }

  if (elementos.FormSolicitud) {
  // Iniciar tipo de solicitud
    iniciarTipoSolicitud().then(() => {
    // Iniciar Select2 después de seleccionar el tipo
      iniciarSelect2()
    })
  }
})

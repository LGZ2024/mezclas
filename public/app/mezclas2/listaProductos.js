/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'

// Función para obtener productos
async function fetchProductos() {
  try {
    const response = await fetch('/api/productos/')
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener productos:', error)
    mostrarMensaje('No se pudieron cargar los productos', 'error')
    return []
  }
}

// Función para manejar el cambio de producto
const handleCambioProducto = async (event) => {
  console.log('Evento change disparado')

  // Encontrar el contenedor del producto
  const contenedorProducto = event.target.closest('.producto-itemm')
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
}
const generarUnidades = (unidadBase) => {
  if (!unidadBase) return []
  // Mapa de unidades equivalentes para litro y kilogramo
  const unidadesMap = {
    litro: ['Litro', 'Mililitro'],
    kilogramo: ['Kilogramo', 'Gramo']
  }
  const unidadNormalizada = unidadBase.toLowerCase().trim()
  return unidadesMap[unidadNormalizada] || [unidadBase]
}

// Función para inicializar el formulario con productos
async function inicializarFormularioProductos() {
  try {
    const datos = await fetchProductos()
    const selectsProducto = document.querySelectorAll('.select-producto')

    selectsProducto.forEach(selectProducto => {
      // Limpiar opciones existentes
      selectProducto.innerHTML = '<option value="">Seleccionar Producto</option>'

      // Añadir productos al select
      const optgroupProductos = document.createElement('optgroup')
      optgroupProductos.label = 'Productos' // Etiqueta para el grupo de productos
      selectProducto.appendChild(optgroupProductos)

      // Agregar nuevas opciones
      datos.productos.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.id_producto
        option.textContent = producto.nombre
        option.dataset.unidadBase = producto.unidad_medida
        selectProducto.appendChild(option)
      })
      // Añadir productos al select
      const optgroupReceta = document.createElement('optgroup')
      optgroupReceta.label = 'Productos Preparados' // Etiqueta para el grupo de productos
      selectProducto.appendChild(optgroupReceta)

      // Añadir productos al select
      datos.recetas.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.id_receta
        option.textContent = producto.nombre
        option.dataset.unidadBase = producto.unidad_medida
        selectProducto.appendChild(option)
      })
      // Después de agregar el nuevo campo al DOM
      iniciarSelect2()
      // Añadir evento de cambio
      selectProducto.removeEventListener('change', handleCambioProducto)
      selectProducto.addEventListener('change', handleCambioProducto)
    })
  } catch (error) {
    console.error('Error al inicializar formulario:', error)
    mostrarMensaje('No se pudieron cargar los productos')
  }
}

const iniciarSelect2 = async () => {
  try {
    if (typeof jQuery === 'undefined') {
      console.error('jQuery no está cargado')
      return
    }
    if (typeof jQuery.fn.select2 === 'undefined') {
      console.error('Select2 no está cargado')
      return
    }

    // Inicializar Select2 con configuración actualizada
    $('.select-producto').select2({
      placeholder: 'Seleccionar Producto',
      allowClear: true,
      dropdownParent: $('#exampleModal'), // Agregar esta línea
      width: '100%' // Opcional: para mejor responsividad
    }).on('select2:select', (e) => {
      const selectNativo = e.target
      const event = new Event('change', { bubbles: true })
      selectNativo.dispatchEvent(event)
    })
  } catch (error) {
    console.error('Error al inicializar Select2:', error)
  }
}
// Agregar el método destruirSelect2
const destruirSelect2 = (elemento) => {
  try {
    $(elemento).select2('destroy')
  } catch (error) {
    console.error('Error al destruir Select2:', error)
  }
}

export const handleModals = async (modalToHide, modalToShow, callback) => {
  try {
    // Cerrar primer modal
    const firstModal = bootstrap.Modal.getInstance(document.getElementById(modalToHide))
    if (firstModal) {
      firstModal.hide()
    }

    // Esperar a que se cierre
    await new Promise(resolve => setTimeout(resolve, 150))

    // Abrir segundo modal
    const secondModal = new bootstrap.Modal(document.getElementById(modalToShow))
    secondModal.show()

    // Ejecutar callback si existe
    if (typeof callback === 'function') {
      callback()
    }
  } catch (error) {
    console.error('Error al manejar modales:', error)
    throw error
  }
}
export { inicializarFormularioProductos, destruirSelect2 }

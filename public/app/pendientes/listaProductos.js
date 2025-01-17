import { mostrarMensaje } from '../mensajes.js'
// Función para generar unidades
function generarUnidades (unidadBase) {
  const unidadesMap = {
    litro: ['Litro', 'Mililitro'],
    kilogramo: ['Kilogramo', 'Gramo']
    // Añadir más unidades según sea necesario
  }

  const unidadNormalizada = unidadBase.toLowerCase().trim()
  return unidadesMap[unidadNormalizada] || [unidadBase]
}

// Función para obtener productos
async function fetchProductos () {
  try {
    const response = await fetch('/api/productos/')
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener productos:', error)
    mostrarMensaje('No se pudieron cargar los productos')
    return []
  }
}

// Función para manejar el cambio de producto
function handleCambioProducto (event) {
  // Encontrar el contenedor del producto
  const contenedorProducto = event.target.closest('.producto-item')

  // Buscar los selects dentro de este contenedor
  const selectUnidadMedida = contenedorProducto.querySelector('.select-unidad-medida')

  // Limpiar select de unidades
  selectUnidadMedida.innerHTML = ''
  selectUnidadMedida.disabled = false

  // Obtener el producto seleccionado
  const productoSeleccionado = event.target.options[event.target.selectedIndex]

  // Verificar si se ha seleccionado un producto válido
  if (productoSeleccionado.value) {
    // Obtener la unidad base del producto
    const unidadBase = productoSeleccionado.dataset.unidadBase

    // Generar unidades
    const unidades = generarUnidades(unidadBase)

    // Agregar opción por defecto
    const optionDefault = document.createElement('option')
    optionDefault.value = ''
    optionDefault.textContent = 'Seleccionar Unidad'
    selectUnidadMedida.appendChild(optionDefault)

    // Agregar unidades al select
    unidades.forEach(unidad => {
      const option = document.createElement('option')
      option.value = unidad.toLowerCase()
      option.textContent = unidad
      selectUnidadMedida.appendChild(option)
    })
  } else {
    // Deshabilitar select de unidades si no hay producto seleccionado
    selectUnidadMedida.disabled = true
  }
}

// Función para inicializar el formulario con productos
async function inicializarFormulario () {
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
      // Añadir evento de cambio
      selectProducto.removeEventListener('change', handleCambioProducto)
      selectProducto.addEventListener('change', handleCambioProducto)
    })
  } catch (error) {
    console.error('Error al inicializar formulario:', error)
    mostrarMensaje('No se pudieron cargar los productos')
  }
}

export { inicializarFormulario }

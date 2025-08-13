/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'
export async function descargarExcel () {
  try {
    // Obtener datos filtrados desde DataTable
    const datos = await obtenerDatosSolicitud()

    const response = await fetch('/api/descargar-solicitud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solicitudes.xlsx'
    a.click()
  } catch (error) {
    console.error('Error al descargar Excel:', error)
    alert('Ocurrió un error al intentar descargar el archivo Excel. Verifique la consola para más detalles.')
    mostrarMensaje({ msg: error.message, type: 'error' })
  }
}

const obtenerDatosSolicitud = async () => {
  const data = {
    id_solicitud: document.getElementById('idSolicitud').value,
    folio: document.getElementById('folioi').value,
    solicita: document.getElementById('solicitai').value,
    fecha_solicitud: document.getElementById('fechai').value,
    rancho_destino: document.getElementById('ranchoi').value,
    centro_coste: document.getElementById('centroCostei').value,
    variedad: document.getElementById('variedadi').value,
    empresa: document.getElementById('empresai').value,
    temporada: document.getElementById('temporadai').value,
    cantidad: document.getElementById('cantidadi').value,
    presentacion: document.getElementById('presentacioni').value,
    metodo_aplicacion: document.getElementById('metodoi').value,
    descripcion: document.getElementById('descripcioni').value
  }
  return data
}

export async function descargarReporte (urls) {
  try {
    // Obtener datos filtrados desde DataTable
    const response = await fetch(urls, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`${error.error}`)
    }

    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'solicitudes.xlsx'
    a.click()
  } catch (error) {
    console.error('Error al descargar Excel:', error)
    mostrarMensaje({ msg: error.message, type: 'error' })
  }
}

/* eslint-disable no-undef */
export async function descargarExcel () {
  try {
    // Obtener datos filtrados desde DataTable
    const datosFiltrados = $('#solicitudes').DataTable().rows({ filter: 'applied' }).data().toArray()
    console.log(datosFiltrados)
    const response = await fetch('/api/descargar-excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ datos: datosFiltrados })
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
  }
}
export async function descargarReporte () {
  try {
    // Obtener datos filtrados desde DataTable
    const datosFiltrados = $('#solicitudes').DataTable().rows({ filter: 'applied' }).data().toArray()
    const response = await fetch('/api/descargarReporte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ datos: datosFiltrados })
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
  }
}
export async function descargarReporteV2 () {
  try {
    // Obtener datos filtrados desde DataTable
    const datosFiltrados = $('#solicitudes').DataTable().rows({ filter: 'applied' }).data().toArray()
    const response = await fetch('/api/descargarReporte-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ datos: datosFiltrados })
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
  }
}

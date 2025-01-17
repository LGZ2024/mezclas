// Función para consultar IDs de transportistas en la base de datos
async function fetchViviendas () {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch('/api/vivienda', options)
  const data = await response.json()
  return data
}

// lista de rutas
export const listaViviendas = async () => {
  const response = await fetchViviendas()
  const viviendas = document.getElementById('vivienda')
  viviendas.innerHTML = ''
  if (response.length) {
    viviendas.append(new Option('Selecciona una Opcion', 0))
    response.forEach(doc => {
      viviendas.append(new Option(doc.nombre, doc.nombre))
    })
  } else {
    viviendas.append(new Option('Error al cargar los datos', 0))
  }
}

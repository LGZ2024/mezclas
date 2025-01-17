/* eslint-disable no-undef */
const ctx1 = document.getElementById('barChart').getContext('2d')
let myChart1
let label
// hacemos peticion para extraer los datos que mostraremos en nuestra grafica
const fucntion = async (tipo) => {
  try {
    const response = await fetch(`/api/gastosUsuario/${tipo}`)
    const datos = await response.json()
    return datos[0]
  } catch (error) {
    console.log(` este es el error ${error}`)
  }
}
function getRandomColor () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}
// crear datos para nuestro char
const obtenerDatos = async (tipo) => {
  const response = await fucntion(tipo)
  const data = []
  const labels = []

  // Función para obtener un valor alternativo si 'nombre' no es válido
  function obtenerValorAlternativo (item) {
    const propiedadesAlternativas = ['temporada', 'rancho', 'centroCoste', 'empresa', 'usuario', 'variedad']
    for (const propiedad of propiedadesAlternativas) {
      if (item[propiedad] && typeof item[propiedad] === 'string' && item[propiedad].trim() !== '') {
        return item[propiedad]
      }
    }
    return null // Si no hay valor alternativo válido
  }

  response.forEach((item) => {
    label = obtenerValorAlternativo(item)
    if (label && item.precio_cantidad !== undefined) {
      labels.push(label)
      data.push(parseFloat(item.precio_cantidad))
    } else {
      console.warn('Item no tiene las propiedades esperadas:', item)
    }
  })
  // Generar colores aleatorios para cada usuario
  const backgroundColors = data.map(() => getRandomColor())
  // hacer la suma de todos los numeros que se encuentran en data
  const suma = data.reduce((a, b) => a + b, 0)
  // pasamos la suma a total gastos
  document.getElementById('gasto').innerHTML = suma
  return { data, labels, backgroundColors }
}

// corres char
export const charUsuarioTotalGasto = async (tipo) => {
  const response = await obtenerDatos(tipo)
  // Comprobar si el gráfico ya está creado
  if (myChart1) {
    myChart1.destroy() // Destruir el gráfico existente
  }
  myChart1 = new Chart(ctx1, {
    type: 'polarArea', // Tipo de gráfico
    data: {
      labels: response.labels,
      datasets: [{
        data: response.data,
        backgroundColor: response.backgroundColors, // Colores aleatorios
        borderColor: response.backgroundColors.map(color => color.replace('rgba', 'rgb').replace(/, 0.5\)/, ', 1)')), // Cambiar a color sólido para el borde
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.dataset.label + ': ' + tooltipItem.raw + ' unidades' // Sufijo para el tooltip
            }
          }
        }
      }
    }
  })
}

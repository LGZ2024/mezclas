/* eslint-disable no-undef */
const setPost = (data) => {
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
const setPostProductos = (data) => {
  const productos = document.getElementById('productos')
  productos.innerHTML = ''
  if (data.length) {
    productos.append(new Option('Selecciona Un Productos', 0))
    data.forEach(doc => { // con esta funcion recorrecmos los documentos traidos desde firebase
      productos.append(new Option(doc.productos, doc.id))
    })
  } else {
    productos.append(new Option('Error al cargar los datos', 0))
  }
}

export { setPost, setPostVariedad, setPostProductos }

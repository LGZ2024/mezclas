import fs from 'fs'
import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const guardarImagen = async ({ imagen }) => {
  if (!imagen) {
    return { message: 'No se ha enviado ninguna imagen o nombre de archivo' }
  }
  // Procesar base64
  const matches = imagen.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    return { message: 'Formato de imagen no válido' }
  }
  const imageData = matches[2]
  const buffer = Buffer.from(imageData, 'base64')
  const imageExtension = path.extname('imagen.jpg')
  const imageName = `image_${Date.now()}${imageExtension}`
  const imagePath = path.join(__dirname + '../../../public/uploads', imageName)
  // Crear la carpeta 'uploads' si no existe
  if (!fs.existsSync(path.join(__dirname + '../../../public/uploads'))) {
    fs.mkdirSync(path.join(__dirname + '../../../public/uploads'))
  }

  // Guardar la imagen en el servidor
  fs.writeFile(imagePath, buffer, (err) => {
    if (err) {
      console.error('Error al guardar la imagen:', err)
      return { message: 'Error al guardar la imagen' }
    }
  })

  const fechaActual = new Date()

  // Obtener el año
  const anio = fechaActual.getFullYear()

  // Obtener el mes (agregar 1 porque los meses comienzan desde 0)
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0')

  // Obtener el día
  const dia = String(fechaActual.getDate()).padStart(2, '0')

  // Formatear la fecha en el formato YYYY-MM-DD
  const fechaFormateada = `${anio}-${mes}-${dia}`

  // Construir la ruta relativa
  const relativePath = `../uploads/${imageName}`
  return { relativePath, fecha: fechaFormateada }
}

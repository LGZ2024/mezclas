import fs from 'fs'
import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const GuardarFoto = ({ imagen }) => {
  if (!imagen) {
    return { error: 'No se ha enviado ninguna imagen o nombre de archivo' }
  }

  // Procesar base64
  const matches = imagen.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    return { error: 'Formato de imagen no válido' }
  }

  const imageData = matches[2]
  const buffer = Buffer.from(imageData, 'base64')

  const imageExtension = path.extname('imagen.jpg')
  const imageName = `image_nimagen${Date.now()}${imageExtension}`
  const imagePath = path.join(__dirname + '../../../public/uploads', imageName)

  // Crear la carpeta 'uploads' si no existe
  if (!fs.existsSync(path.join(__dirname + '../../../public/uploads'))) {
    fs.mkdirSync(path.join(__dirname + '../../../public/uploads'))
  }

  // Guardar la imagen en el servidor
  fs.writeFile(imagePath, buffer, (err) => {
    if (err) {
      console.error('Error al guardar la imagen:', err)
      return { error: 'Error al guardar la imagen' }
    }
  })

  console.log(imagePath)

  const pathParts = imagePath.split('\\')

  // Obtener la última parte de la ruta (el nombre del archivo)
  const fileName = pathParts[pathParts.length - 1]

  // Construir la ruta relativa
  const relativePath = `../uploads/${fileName}`

  console.log(relativePath)

  // fecha
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toLocaleString()

  return { fechaFormateada, relativePath }
}

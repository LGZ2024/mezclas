import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración
const CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadDir: path.join(__dirname, '../../public/uploads')
}

export const guardarImagen = async ({ imagen }) => {
  try {
    if (!imagen) {
      throw new Error('No se ha enviado ninguna imagen')
    }

    // Validar formato base64
    const matches = imagen.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de imagen no válido')
    }

    // Validar tipo de imagen
    const mimeType = `image/${matches[1]}`
    if (!CONFIG.allowedTypes.includes(mimeType)) {
      throw new Error('Tipo de imagen no permitido')
    }

    // Validar tamaño
    const buffer = Buffer.from(matches[2], 'base64')

    if (buffer.length > CONFIG.maxSize) {
      throw new Error('Imagen demasiado grande')
    }

    // Verificar y crear directorio
    try {
      const stats = await fs.stat(CONFIG.uploadDir)
      if (!stats.isDirectory()) {
        throw new Error('La ruta de uploads no es un directorio')
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Creando directorio de uploads...')
        await fs.mkdir(CONFIG.uploadDir, { recursive: true })
      } else {
        throw error
      }
    }

    // Generar nombre único
    const imageExtension = `.${matches[1]}`
    const imageName = `image_${Date.now()}_${Math.random().toString(36).substring(2)}${imageExtension}`
    const imagePath = path.join(CONFIG.uploadDir, imageName)

    // Debug: Mostrar ruta completa
    console.log('Ruta completa de la imagen:', imagePath)

    // Guardar imagen con manejo de errores específico
    try {
      await fs.writeFile(imagePath, buffer)
      console.log('Imagen guardada exitosamente')
    } catch (writeError) {
      console.error('Error al escribir el archivo:', writeError)
      throw new Error(`Error al guardar la imagen: ${writeError.message}`)
    }

    // Verificar que el archivo se haya creado
    try {
      await fs.access(imagePath)
      console.log('Archivo verificado correctamente')
    } catch (accessError) {
      console.error('El archivo no se creó correctamente:', accessError)
      throw new Error('No se pudo verificar la creación del archivo')
    }

    // Formatear fecha
    const fechaActual = new Date()
    const fechaFormateada = fechaActual.toISOString().split('T')[0]

    console.log('ruta absoluta:', imagePath)
    return {
      relativePath: `../uploads/${imageName}`,
      fecha: fechaFormateada,
      success: true
    }
  } catch (error) {
    console.error('Error en guardarImagen:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

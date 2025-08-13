import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración
const CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadDir: path.join(__dirname, '..', 'uploads', 'images'),
  uploadDirActivo: path.join(__dirname, '..', 'uploads', 'fotos_activos'),
  uploadDirPdfActivo: path.join(__dirname, '..', 'uploads', 'pdfs_activos')

}

export const guardarImagen = async ({ imagen }) => {
  try {
    logger.info('Guardando imagen...')
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
        logger.info('Creando directorio de uploads...')
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
    logger.debug('Ruta completa de la imagen:', imagePath)

    try {
      await fs.writeFile(imagePath, buffer)
      logger.info('Imagen guardada exitosamente')
    } catch (writeError) {
      logger.error('Error al escribir el archivo:', writeError)
      throw new Error(`Error al guardar la imagen: ${writeError.message}`)
    }

    // Verificar que el archivo se haya creado
    try {
      await fs.access(imagePath)
      logger.info('Archivo verificado correctamente')
    } catch (accessError) {
      logger.error('El archivo no se creó correctamente:', accessError)
      throw new Error('No se pudo verificar la creación del archivo')
    }

    // Formatear fecha
    const fechaActual = new Date()
    const fechaFormateada = fechaActual.toISOString().split('T')[0]

    logger.info(`ruta absoluta: ${imagePath}`

    )
    return {
      relativePath: `/uploads/images/${imageName}`,
      fecha: fechaFormateada,
      success: true
    }
  } catch (error) {
    logger.error('Error en guardarImagen:', error)
    throw error
  }
}
export const guardarFoto = async ({ imagen }) => {
  try {
    logger.info('Guardando imagen...')
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
        logger.info('Creando directorio de uploads...')
        await fs.mkdir(CONFIG.uploadDir, { recursive: true })
      } else {
        throw error
      }
    }

    // Generar nombre único
    const imageExtension = `.${matches[1]}`
    const imageName = `image_${Date.now()}_${Math.random().toString(36).substring(2)}${imageExtension}`
    const imagePath = path.join(CONFIG.uploadDirActivo, imageName)

    // Debug: Mostrar ruta completa
    logger.debug('Ruta completa de la imagen:', imagePath)

    try {
      await fs.writeFile(imagePath, buffer)
      logger.info('Imagen guardada exitosamente')
    } catch (writeError) {
      logger.error('Error al escribir el archivo:', writeError)
      throw new Error(`Error al guardar la imagen: ${writeError.message}`)
    }

    // Verificar que el archivo se haya creado
    try {
      await fs.access(imagePath)
      logger.info('Archivo verificado correctamente')
    } catch (accessError) {
      logger.error('El archivo no se creó correctamente:', accessError)
      throw new Error('No se pudo verificar la creación del archivo')
    }

    // Formatear fecha
    const fechaActual = new Date()
    const fechaFormateada = fechaActual.toISOString().split('T')[0]

    logger.info(`ruta absoluta: ${imagePath}`

    )
    return {
      relativePath: `/uploads/fotos_activos/${imageName}`,
      fecha: fechaFormateada,
      success: true
    }
  } catch (error) {
    logger.error('Error en guardarImagen:', error)
    throw error
  }
}
export const guardarPDF = async ({ pdf }) => {
  try {
    logger.info('Guardando PDF...')
    if (!pdf) {
      throw new Error('No se ha enviado ningún PDF')
    }

    // Validar formato base64
    const matches = pdf.match(/^data:application\/pdf;base64,(.+)$/)
    if (!matches || matches.length !== 2) {
      throw new Error('Formato de PDF no válido')
    }

    // Validar tipo de archivo
    const mimeType = 'application/pdf'
    if (mimeType !== 'application/pdf') {
      throw new Error('Tipo de archivo no permitido')
    }

    // Validar tamaño
    const buffer = Buffer.from(matches[1], 'base64')
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (buffer.length > maxSize) {
      throw new Error('PDF demasiado grande')
    }

    // Verificar y crear directorio
    try {
      const stats = await fs.stat(CONFIG.uploadDirPdfActivo)
      if (!stats.isDirectory()) {
        throw new Error('La ruta de uploads no es un directorio')
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('Creando directorio de uploads para PDF...')
        await fs.mkdir(CONFIG.uploadDirPdfActivo, { recursive: true })
      } else {
        throw error
      }
    }

    // Generar nombre único
    const pdfName = `pdf_${Date.now()}_${Math.random().toString(36).substring(2)}.pdf`
    const pdfPath = path.join(CONFIG.uploadDirPdfActivo, pdfName)

    // Guardar archivo
    try {
      await fs.writeFile(pdfPath, buffer)
      logger.info('PDF guardado exitosamente')
    } catch (writeError) {
      logger.error('Error al escribir el archivo PDF:', writeError)
      throw new Error(`Error al guardar el PDF: ${writeError.message}`)
    }

    // Verificar que el archivo se haya creado
    try {
      await fs.access(pdfPath)
      logger.info('Archivo PDF verificado correctamente')
    } catch (accessError) {
      logger.error('El archivo PDF no se creó correctamente:', accessError)
      throw new Error('No se pudo verificar la creación del archivo PDF')
    }

    // Formatear fecha
    const fechaActual = new Date()
    const fechaFormateada = fechaActual.toISOString().split('T')[0]

    logger.info(`ruta absoluta PDF: ${pdfPath}`)

    return {
      relativePath: `/uploads/pdfs_activos/${pdfName}`,
      fecha: fechaFormateada,
      success: true
    }
  } catch (error) {
    logger.error('Error en guardarPDF:', error)
    throw error
  }
}

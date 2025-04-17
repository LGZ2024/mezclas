import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const guardarResponsiva = async ({ documento, empleado }) => {
// Configuración para PDFs
  const CONFIG = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
    uploadDir: path.join(__dirname, '..', 'uploads', 'responsivas', `${empleado}`)
  }
  try {
    logger.info('Guardando responsiva...')
    if (!documento) {
      throw new Error('No se ha enviado ningún documento')
    }

    // Validar formato base64
    const matches = documento.match(/^data:application\/pdf;base64,(.+)$/)
    if (!matches || matches.length !== 2) {
      throw new Error('Formato de documento no válido. Debe ser PDF')
    }

    // Validar tipo de documento
    const mimeType = 'application/pdf'
    if (!CONFIG.allowedTypes.includes(mimeType)) {
      throw new Error('Tipo de documento no permitido. Solo se aceptan PDFs')
    }

    // Validar tamaño
    const buffer = Buffer.from(matches[1], 'base64')
    if (buffer.length > CONFIG.maxSize) {
      throw new Error('Documento demasiado grande. Máximo 10MB')
    }

    // Verificar y crear directorio
    try {
      const stats = await fs.stat(CONFIG.uploadDir)
      if (!stats.isDirectory()) {
        throw new Error('La ruta de uploads no es un directorio')
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('Creando directorio de responsivas...')
        await fs.mkdir(CONFIG.uploadDir, { recursive: true })
      } else {
        throw error
      }
    }

    // Generar nombre único
    const fechaActual = new Date()
    const timestamp = fechaActual.getTime()
    const docName = `responsiva_${timestamp}_${Math.random().toString(36).substring(2)}.pdf`
    const docPath = path.join(CONFIG.uploadDir, docName)

    // Debug: Mostrar ruta completa
    logger.debug('Ruta completa del documento:', docPath)

    try {
      await fs.writeFile(docPath, buffer)
      logger.info('Responsiva guardada exitosamente')
    } catch (writeError) {
      logger.error('Error al escribir el archivo:', writeError)
      throw new Error(`Error al guardar la responsiva: ${writeError.message}`)
    }

    // Verificar que el archivo se haya creado
    try {
      await fs.access(docPath)
      logger.info('Archivo verificado correctamente')
    } catch (accessError) {
      logger.error('El archivo no se creó correctamente:', accessError)
      throw new Error('No se pudo verificar la creación del archivo')
    }

    logger.info(`Ruta absoluta: ${docPath}`)

    return {
      relativePath: `/uploads/responsivas/${docName}`
    }
  } catch (error) {
    logger.error('Error en guardarResponsiva:', error)
    throw error
  }
}

// Función adicional para validar PDF
export const validarPDF = (base64String) => {
  try {
    // Verificar el encabezado del PDF en base64
    const header = base64String.substring(0, 4)
    const decodedHeader = Buffer.from(header, 'base64').toString('ascii')

    // El encabezado de un PDF comienza con %PDF
    if (!decodedHeader.startsWith('%PDF')) {
      throw new Error('El archivo no es un PDF válido')
    }

    return true
  } catch (error) {
    logger.error('Error al validar PDF:', error)
    return false
  }
}

import { v4 as uuidv4 } from 'uuid'
import { writeFile } from 'fs/promises'
import { join } from 'path'

import logger from '../utils/logger.js'
import { ValidationError, NotFoundError, DatabaseError, CustomError } from '../utils/CustomError.js'

export class UploadsController {
  agregarImagenes = async (req, res) => {
    try {
      const { image } = req.body

      // Extraer extensión y datos
      const matches = image.match(/^data:image\/(.*?);base64,/)
      const fileExtension = matches[1]
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

      // Generar nombre único
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = join(process.cwd(), 'uploads', 'images', fileName)

      // Guardar archivo
      await writeFile(filePath, base64Data, 'base64')

      res.json({
        message: 'Imagen guardada correctamente',
        fileName,
        path: `/uploads/images/${fileName}`
      })
    } catch (error) {
      throw new DatabaseError('Error al guardar imagen')
    }
  }

  obtenerImagenes = async (req, res) => {
    const { user } = req.session
    try {
      // Verificar si el usuario está autenticado (el middleware ya lo hace, pero por seguridad extra)
      if (!user) {
        logger.error('Usuario no autenticado')
        throw new ValidationError('Usuario no autenticado')()
      }

      const { filename } = req.params
      logger.debug('filename', filename)
      const imagePath = join(__dirname, '..', 'uploads', 'images', filename)
      res.sendFile(imagePath, (err) => {
        if (err) {
          logger.error(`Error al enviar imagen:${err}`)
          throw new NotFoundError('Imagen no encontrada')
        }
      })
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener imagen')
    }
  }
}

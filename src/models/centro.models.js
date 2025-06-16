import { Centrocoste } from '../schema/centro.js'
import logger from '../utils/logger.js'
import { ValidationError, DatabaseError, CustomError, NotFoundError } from '../utils/CustomError.js'

export class CentroCosteModel {
  // uso
  static async getAll () {
    try {
      const centroCoste = await Centrocoste.findAll({
        attributes: ['id', 'centroCoste', 'empresa', 'rancho', 'cultivo', 'variedad']
      })
      if (!centroCoste) throw new NotFoundError('Centro de coste no encontrados')
      return centroCoste
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los centros de coste')
    }
  }

  // uso
  static async getCentrosPorRancho ({ rancho, cultivo }) {
    let centros
    const logContext = {
      operation: 'GET_CENTROS_POR_RANCHO_Modelo',
      rancho,
      cultivo
    }
    try {
      logger.logModelOperation('GET_CENTROS_POR_RANCHO', logContext)
      // validamos datos
      if (!rancho || !cultivo) {
        throw new ValidationError(`Datos requeridos no proporcionados: rancho: ${rancho}, cultivo: ${cultivo}`)
      }

      if (cultivo === 'General') {
        centros = await Centrocoste.findAll({
          where: {
            rancho
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        })
      } else {
        centros = await Centrocoste.findAll({
          where: {
            rancho,
            cultivo
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        })
      }
      if (!centros) throw new NotFoundError('No se encontraron centros de coste para este rancho')

      return centros
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener los centros de coste', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  // uso
  static async getVariedadPorCentroCoste ({ id }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      const variedades = await Centrocoste.findAll({
        where: {
          id
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      })
      if (!variedades) throw new NotFoundError('No se encontraron variedades de este centro de coste')

      return variedades
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los variedades de centro de coste')
    }
  }

  // uso
  static async porcentajeVariedad ({ id, data }) {
    try {
      // validados datos
      if (!id || !data) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Verificar si existe el centro de coste
      const centroCoste = await Centrocoste.findByPk(id)
      if (!centroCoste) {
        throw new NotFoundError('Centro de coste no encontrado')
      }
      // Actualiza solo los campos que se han proporcionado
      if (data) centroCoste.porcentajes = data
      await centroCoste.save()

      return {
        message: 'Porcentajes actualizados correctamente'
      }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar porcentajes')
    }
  }

  static async getOne ({ id }) {
    try {
      const usuario = await Centrocoste.findByPk(id)
      return usuario || { error: 'usuario no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener al usuario' }
    }
  }

  static async getVariedadPorCentroCosteNombre ({ centroCoste }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          centroCoste
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      })

      return variedades.length > 0 ? variedades : { message: 'No se encontraron variedades de este centro de coste' }
    } catch (e) {
      console.error(e.message) // Salida: Error al obtener los variedades de coste
      return { error: 'Error al obtener los variedades de centro de coste' }
    }
  }

  static async delete ({ id }) {
    try {
      const usuario = await Centrocoste.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }

      await usuario.destroy()
      return { message: `usuario eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al elimiar el usuario' }
    }
  }

  static async create ({ data }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Centrocoste.findOne({ where: { usuario: data.usuario } })
      if (usuario) return { error: 'usuario ya existe' }
      // creamos el usuario
      await Centrocoste.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al crear al usuario' }
    }
  }
}

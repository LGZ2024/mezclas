import { Equipos } from '../schema/equipos.js'
import { Asignaciones } from '../schema/asignaciones.js'
import { HistorialEquipo } from '../schema/historial_equipo.js'
import fs from 'fs'
import path from 'path'
// utils
import { DatabaseError, CustomError, NotFoundError, ValidationError } from '../utils/CustomError.js'
import { DbHelper } from '../utils/dbHelper.js'
export class EquiposModel {
  // uso
  static async getAllDisponible () {
    try {
      const equipo = await Equipos.findAll({
        where: {
          status: 'disponible'
        },
        attributes: ['id', 'ns', 'equipo']
      })
      if (!equipo) throw new NotFoundError('Equipos de coste no encontrados')
      return equipo
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los equipos')
    }
  }

  static async cambiarEstado ({ logger, logContext, id, data }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // validamos el id
        if (!id) throw new ValidationError('ID del equipo es requerido')
        // validamos los datos
        if (!data || !data.estado) throw new ValidationError('Estado es requerido')
        // validamos si el equipo esta asignado
        const asignacion = await Asignaciones.findOne({ where: { id_equipo: id, estado: 'asignado' } })
        if (asignacion) throw new ValidationError('Equipo ya se encuentra asignado')

        // verificamos que el equipo exista
        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new NotFoundError('Equipo no encontrado')

        // actualizamos el estado del equipo
        equipo.status = data.estado
        if (data.estado === 'baja') equipo.fecha_baja = new Date()

        await equipo.save({ transaction })

        // registramos el cambio en el historial
        await HistorialEquipo.create({
          id_equipo: id,
          estado: data.estado,
          fecha_registro: new Date(),
          motivo: data.motivo || 'Cambio de estado'
        }, { transaction })

        return { message: `Estado del equipo ${id} cambiado a ${data.estado}` }
      } catch (error) {
        logger.error('Error al cambiar el estado del equipo', {
          ...logContext,
          error: error.message,
          stack: error.stack
        })
        throw error
      }
    })
  }

  static async eliminarActivo ({ logger, logContext, id, estado }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // validamos el id
        if (!id) throw new ValidationError('ID del equipo es requerido')
        // validamos el estado
        if (!estado) throw new ValidationError('Estado es requerido')

        if (estado !== 'disponible') {
          throw new ValidationError('No se puede eliminar un equipo que no está disponible.')
        }

        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new NotFoundError('equipo no encontrado')

        await equipo.destroy({ transaction })
        return { message: `equipo eliminado correctamente con id ${id}` }
      } catch (e) {
        logger.error('Error al eliminar equipo', {
          ...logContext,
          error: {
            name: e.name,
            message: e.message,
            stack: e.stack,
            code: e.code
          }
        })
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al eliminar el equipo')
      }
    })
  }

  static async agregarActivo ({ logger, logContext, data }) {
    try {
      // verificamos que no exista el equipo
      const equipo = await Equipos.findOne({ where: { no_economico: data.no_economico } })
      if (equipo) return { error: 'Equipo ya existe' }
      // creamos el equipo
      await Equipos.create({ ...data })
      return { message: `Activo registrado exitosamente ${data.no_economico}` }
    } catch (e) {
      logger.error('Error al crear activo', {
        ...logContext,
        error: {
          name: e.name,
          message: e.message,
          stack: e.stack,
          code: e.code
        }
      })
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al crear el activo')
    }
  }

  static async editarActivo ({ logger, logContext, data, id }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
      // verificamos que no exista el usuario
        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new NotFoundError('Equipo no encontrado')
        // actualizamos el equipo
        await equipo.update({ ...data }, { transaction })
        return { message: `Activo actualizado exitosamente ${id}` }
      } catch (e) {
        logger.error('Error al crear activo', {
          ...logContext,
          error: {
            name: e.name,
            message: e.message,
            stack: e.stack,
            code: e.code
          }
        })
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al ediatar el activo')
      }
    })
  }

  static async agregarFoto ({ logger, logContext, imagen, id }) {
    return await DbHelper.withTransaction(async (transaction) => {
      let relativePath
      try {
        // verificamos que el equipo exista
        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new ValidationError('Equipo no encontrado')
        // agregamos la imagen
        if (!imagen) throw new ValidationError('No se ha enviado ninguna imagen')
        relativePath = `/uploads/activos/foto/${imagen}`
        equipo.foto = relativePath
        await equipo.save({ transaction })
        return { message: `Imagen agregada exitosamente al equipo ${id}` }
      } catch (e) {
        // Si ya se guardó la imagen, eliminarla
        if (relativePath) {
          try {
            const absolutePath = path.resolve(process.cwd(), relativePath)
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath)
            }
          } catch (err) {
            console.error('Error al eliminar la imagen guardada:', err.message)
          }
        }
        console.error(e.message) // Salida: Error al agregar la imagen
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al crear la imagen')
      }
    })
  }

  static async agregarFactura ({ logger, logContext, factura, data, id }) {
    return await DbHelper.withTransaction(async (transaction) => {
      let relativePath
      try {
        // verificamos que el equipo exista
        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new ValidationError('Equipo no encontrado')
        // agregamos la factura
        if (!factura) throw new ValidationError('No se ha enviado ninguna factura')
        relativePath = `/uploads/activos/factura/${factura}`
        equipo.url_factura = relativePath
        equipo.empresa_pertenece = data.empresa_pertenece || ''
        equipo.centro_coste = data.centro_coste || ''
        await equipo.save({ transaction })
        return { message: `Factura agregada exitosamente al equipo ${id}` }
      } catch (e) {
        // Si ya se guardó la factura, eliminarla
        if (relativePath) {
          try {
            const absolutePath = path.resolve(process.cwd(), relativePath)
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath)
            }
          } catch (err) {
            console.error('Error al eliminar la factura guardada:', err.message)
          }
        }
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al agregar la factura')
      }
    })
  }

  static async agregarBaja ({ logger, logContext, baja, id }) {
    return await DbHelper.withTransaction(async (transaction) => {
      let relativePath
      try {
        // verificamos que el equipo exista
        const equipo = await Equipos.findByPk(id)
        if (!equipo) throw new ValidationError('Equipo no encontrado')
        // agregamos la baja
        if (!baja) throw new ValidationError('No se ha enviado ninguna baja')
        relativePath = `/uploads/activos/baja/${baja}`
        equipo.documento_baja = relativePath
        equipo.status = 'baja'
        await equipo.save({ transaction })
        return { message: `Baja agregada exitosamente al equipo ${id}` }
      } catch (e) {
        // Si ya se guardó la baja, eliminarla
        if (relativePath) {
          try {
            const absolutePath = path.resolve(process.cwd(), relativePath)
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath)
            }
          } catch (err) {
            console.error('Error al eliminar la factura guardada:', err.message)
          }
        }
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al agregar la baja')
      }
    })
  }
}

import { Asignaciones } from '../schema/asignaciones.js'
import { Empleados } from '../schema/empleados.js'
import { Equipos } from '../schema/equipos'
import { guardarResponsiva } from '../config/responsivas.js'

// utils
import { sequelize } from '../db/db.js'
import logger from '../utils/logger.js'

import { DatabaseError, CustomError, ValidationError, NotFoundError } from '../utils/CustomError.js'
export class AsignacionesModel {
  /**
 * Agrega una nueva asignación de equipo a un empleado
 * @param {Object} params - Parámetros de la asignación
 * @param {number} params.usuarioId - ID del empleado
 * @param {number} params.equipoId - ID del equipo
 * @param {Date} params.fechaAsignacion - Fecha de asignación
 * @param {string} params.ubicacion - Ubicación del equipo
 * @param {string} params.responsiva - Documento de responsiva en base64
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {ValidationError} Si faltan datos o son inválidos
 * @throws {NotFoundError} Si no se encuentra el empleado o equipo
 * @throws {DatabaseError} Si hay un error en la base de datos
 */
  static async agregarAsignacion ({ usuarioId, equipoId, fechaAsignacion, ubicacion, responsiva }) {
    const transaction = await sequelize.transaction()
    try {
      // validamos datos
      if (!usuarioId || !equipoId || !fechaAsignacion || !ubicacion || !responsiva) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }

      if (new Date(fechaAsignacion) > new Date()) {
        throw new ValidationError('La fecha de asignación no puede ser futura')
      }

      logger.info('Iniciando asignación de equipo', {
        usuarioId,
        equipoId,
        fechaAsignacion
      })
      // obtenemos datos de empleado
      const empleado = await Empleados.findByPk({
        where: { id: usuarioId },
        attributes: ['nombre', 'apellido_paterno', 'estado'],
        transaction
      })
      if (!empleado) throw new NotFoundError(`No se encontraron datos del Empleado con id:${usuarioId}`)

      // guardamos responsiva en directorio
      const { relativePath } = await guardarResponsiva({ documento: responsiva, empleado: `${empleado.nombre}_${empleado.apellido_paterno}` })

      // actualizamos estado de empleado
      empleado.estado = 'asignado'
      await empleado.save({ transaction })

      // actulizar equipo
      const equipo = await Equipos.findByPk({ id: equipoId })
      equipo.estado = 'asignado'
      await equipo.save({ transaction })

      // creamos asginacion
      await Asignaciones.create({ id_empleado: usuarioId, id_equipo: equipoId, fecha_asignacion: fechaAsignacion, ubicacion, responsiva: relativePath }, { transaction })
      await transaction.commit()
      logger.info('Asignación completada exitosamente', {
        empleadoId: usuarioId,
        equipoId
      })
      return { message: `Aginacion de equipo agregada correctamente a:${empleado.nombre}` }
    } catch (e) {
      await transaction.rollback()
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al crear al usuario')
    }
  }
}

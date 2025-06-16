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
    const logContext = {
      operation: 'AGREGAR_ASIGNACION',
      userId: usuarioId,
      equipoId,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('AGREGAR_ASIGNACION', 'started', logContext)

      // Validación de datos de entrada
      if (!usuarioId || !equipoId || !fechaAsignacion || !ubicacion || !responsiva) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['usuarioId', 'equipoId', 'fechaAsignacion', 'ubicacion', 'responsiva'],
          received: { usuarioId, equipoId, fechaAsignacion, ubicacion, responsiva }
        })
      }

      if (new Date(fechaAsignacion) > new Date()) {
        throw new ValidationError('La fecha de asignación no puede ser futura')
      }

      const transaction = await sequelize.transaction()

      try {
        logger.logDBTransaction('AGREGAR_ASIGNACION', 'started', {
          userId: usuarioId,
          correlationId: logContext.correlationId
        })

        // Verificar empleado
        const empleado = await Empleados.findByPk(usuarioId, {
          attributes: ['nombre', 'apellido_paterno', 'estado'],
          transaction
        })

        if (!empleado) {
          throw new NotFoundError('Empleado no encontrado')
        }

        if (empleado.estado !== 'disponible') {
          throw new ValidationError('El empleado no está disponible para asignaciones')
        }

        // Verificar equipo
        const equipo = await Equipos.findByPk(equipoId, {
          transaction
        })

        if (!equipo) {
          throw new NotFoundError('Equipo no encontrado')
        }

        if (equipo.estado !== 'disponible') {
          throw new ValidationError('El equipo no está disponible para asignación')
        }

        // Crear asignación
        const asignacion = await Asignaciones.create({
          id_empleado: usuarioId,
          id_equipo: equipoId,
          fecha_asignacion: fechaAsignacion,
          ubicacion,
          responsiva
        }, { transaction })

        // Actualizar estado del equipo
        await equipo.update({ estado: 'asignado' }, { transaction })

        // Actualizar estado del empleado si es necesario
        await empleado.update({ estado: 'asignado' }, { transaction })

        await transaction.commit()

        logger.logDBTransaction('AGREGAR_ASIGNACION', 'committed', {
          asignacionId: asignacion.id,
          correlationId: logContext.correlationId
        })

        logger.logOperation('AGREGAR_ASIGNACION', 'completed', {
          ...logContext,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return {
          message: 'Asignación creada correctamente',
          asignacion: {
            id: asignacion.id,
            empleado: empleado.nombre + ' ' + empleado.apellido_paterno,
            equipo: equipo.equipo,
            fechaAsignacion
          }
        }
      } catch (error) {
        await transaction.rollback()

        logger.logDBTransaction('AGREGAR_ASIGNACION', 'rolled_back', {
          error: error.message,
          correlationId: logContext.correlationId
        })

        throw error
      }
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al crear asignación', {
        originalError: error.message,
        context: logContext
      })
    }
  }
}

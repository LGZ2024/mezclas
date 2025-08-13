import { Asignaciones } from '../schema/asignaciones.js'
import { Empleados } from '../schema/empleados.js'
import { Equipos } from '../schema/equipos.js'

// utils
import { DbHelper } from '../utils/dbHelper.js'
import fs from 'fs'

import { DatabaseError, CustomError, ValidationError, NotFoundError } from '../utils/CustomError.js'
import { Usuario } from '../schema/usuarios.js'
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
  static async agregarAsignacion ({ data, responsiva, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validación de datos de entrada
        if (!data) {
          throw new ValidationError('Datos requeridos no proporcionados')
        }

        if (new Date(data.fecha_asignacion) > new Date()) {
          throw new ValidationError('La fecha de asignación no puede ser futura')
        }

        try {
          // Verificar empleado
          const empleado = await Empleados.findByPk(data.id_empleado, {
            attributes: ['nombre', 'apellido_paterno', 'estado']
          })

          if (!empleado) {
            throw new NotFoundError('Empleado no encontrado')
          }

          if (empleado.estado !== 'disponible') {
            throw new ValidationError('El empleado no está disponible para asignaciones')
          }

          // Verificar equipo
          const equipo = await Equipos.findByPk(data.id_equipo, {
            attributes: ['equipo', 'status']
          })
          if (!equipo) {
            throw new NotFoundError('Equipo no encontrado')
          }

          if (equipo.status !== 'disponible') {
            throw new ValidationError('El equipo no está disponible para asignación')
          }
          const relativePath = responsiva ? `/uploads/responsivas_activos/${responsiva.filename}` : null
          // Crear asignación
          const asignacion = await Asignaciones.create({ ...data, responsiva: relativePath }, { transaction })
          // Actualizar estado del equipo usando el ID
          await Equipos.update(
            { status: 'asignado' },
            {
              where: { id: data.id_equipo },
              transaction
            }
          )
          // Actualizar estado del empleado usando el ID
          await Empleados.update(
            { estado: 'asignado' },
            {
              where: { id: data.id_empleado },
              transaction
            }
          )

          return {
            message: 'Asignación creada correctamente',
            asignacion: {
              id: asignacion.id,
              empleado: empleado.nombre + ' ' + empleado.apellido_paterno,
              equipo: equipo.equipo,
              fecha_asignacion: asignacion.fecha_asignacion
            }
          }
        } catch (error) {
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
    })
  }

  static async editarAsignacion ({ id, data, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validación de datos de entrada
        if (!data) {
          throw new ValidationError('Datos requeridos no proporcionados')
        }

        // Verificar asignación existente
        const asignacion = await Asignaciones.findByPk(id)
        if (!asignacion) {
          throw new NotFoundError('Asignación no encontrada')
        }

        // Actualizar asignación
        asignacion.estado = data.estadoTabEdit || asignacion.estado
        if (data.estadoTabEdit === 'cambio' || data.estadoTabEdit === 'recepcion') {
          asignacion.fecha_devolucion = new Date()
        }

        await asignacion.save({ transaction })

        const equipos = await Equipos.findByPk(asignacion.id_equipo)

        if (!equipos) {
          throw new NotFoundError('Equipo no encontrado')
        }

        // Actualizar estado del equipo
        equipos.status = data.estadoTabEdit === 'cambio' ? 'disponible' : data.estadoTabEdit === 'recepcion' ? 'disponible' : equipos.status

        await equipos.save({ transaction })

        // Actualizar estado del empleado en caso 'cambio' o 'recepcion'
        if (data.estadoTabEdit === 'cambio' || data.estadoTabEdit === 'recepcion') {
          Usuario.update(
            { estado: 'disponible' },
            {
              where: { id: asignacion.id_empleado },
              transaction
            }
          )
        }
        return {
          message: `Asignación actualizada correctamente ${asignacion.id} con estado ${asignacion.estado}`,
          asignacion: {
            id: asignacion.id,
            estado: asignacion.estado,
            fecha_asignacion: asignacion.fecha_asignacion
          }
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al actualizar asignación', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async editarResponsiva ({ id, responsiva, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validación de datos de entrada
        if (!responsiva) {
          throw new ValidationError('Archivo de responsiva no proporcionado')
        }

        // Verificar asignación existente
        const asignacion = await Asignaciones.findByPk(id)
        if (!asignacion) {
          throw new NotFoundError('Asignación no encontrada')
        }
        // guardamos la direccion de la responsiva anterior
        const direcionResponsiva = asignacion.responsiva

        const relativePath = `/uploads/responsivas_activos/${responsiva.filename}`
        // Actualizar responsiva
        asignacion.responsiva = relativePath

        await asignacion.save({ transaction })

        // eliminamos el archivo anterior si existe
        if (direcionResponsiva) {
          await eliminarArchivo(direcionResponsiva)
        }

        logger.info('Responsiva de asignación editada exitosamente', logContext)
        return {
          message: 'Responsiva de asignación editada exitosamente',
          asignacion: {
            id: asignacion.id,
            responsiva: asignacion.responsiva
          }
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al editar responsiva de asignación', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }
}

const eliminarArchivo = async (ruta) => {
  try {
    await fs.promises.unlink(ruta)
    console.log(`Archivo eliminado: ${ruta}`)
  } catch (error) {
    console.error(`Error al eliminar archivo: ${ruta}`, error)
  }
}

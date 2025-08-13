import { DbHelper } from '../utils/dbHelper.js'
import { SolicitudServicio } from '../schema/solicitud_servicio.js'
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  CustomError
} from '../utils/CustomError.js'
import { Op } from 'sequelize'
export class SolicitudServicioModel {
  static async agregarTicket ({ data, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar data
        if (!data) {
          throw new ValidationError('La informacion para agregar el ticket es requerida')
        }
        console.log(data)
        // Crear usuario dentro de una transacción
        const unidades = await SolicitudServicio.create({ ...data }, { transaction })

        logger.info('Ticket creado exitosamente', {
          id: unidades.id,
          no_economico: unidades.no_economico,
          marca: unidades.marca
        })

        return { message: 'Ticket Registrado correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al crear ticket', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async obtenerServicios ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await SolicitudServicio.findAll({
          where: {
            estado: {
              [Op.ne]: ['cerrado']
            }
          },
          attributes: ['id', 'estado']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener los talleres')
      }
    })
  }

  static async obtenerTicket ({ id, logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await SolicitudServicio.findOne({
          where: { id },
          attributes: ['id', 'fecha', 'no_economico', 'centro_coste', 'prioridad', 'mantenimiento', 'taller_asignado', 'reparacion_solicitada', 'responsable', 'kilometraje', 'fecha_salida', 'estado', 'observaciones']
        })
        return { message: 'Ticket encontrado', unidades }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener el ticket', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async cerrarTicket ({ id, datos, logger, logContext }) {
    if (!datos) {
      throw new ValidationError('La informacion para cerrar el ticket es nesesaria')
    }
    return await DbHelper.withTransaction(async (transaction) => {
      const estado = 'cerrado'
      try {
        const ticket = await SolicitudServicio.findByPk(id)
        if (!ticket) throw new NotFoundError('Ticket no encontrado')

        if (datos.temporada) ticket.temporada = datos.temporada
        if (datos.factura) ticket.factura = datos.factura
        if (datos.fecha_factura) ticket.fecha_factura = datos.fecha_factura
        if (datos.reparacion_efectuada) ticket.reparacion_efectuada = datos.reparacion_efectuada
        if (datos.precio) ticket.precio = datos.precio
        if (estado) ticket.estado = estado

        await ticket.save({ transaction })

        return { message: 'Ticket Cerrado correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
          }
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al crear ticket', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async PendienteTicket ({ id, datos, logger, logContext }) {
    if (!datos) {
      throw new ValidationError('La informacion para cerrar el ticket es nesesaria')
    }
    return await DbHelper.withTransaction(async (transaction) => {
      const estado = 'pendiente'
      try {
        const ticket = await SolicitudServicio.findByPk(id)
        if (!ticket) throw new NotFoundError('Ticket no encontrado')

        if (estado) ticket.estado = estado

        await ticket.save({ transaction })

        return { message: 'Ticket Guardado Como Pendiente Correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
          }
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al cambiar el estado del ticket', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async obtenerTickets ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await SolicitudServicio.findAll({
          where: {
            estado: {
              [Op.ne]: ['cerrado']
            }
          },
          attributes: ['id', 'fecha', 'no_economico', 'centro_coste', 'prioridad', 'mantenimiento', 'taller_asignado', 'reparacion_solicitada', 'responsable', 'kilometraje', 'fecha_salida', 'estado', 'observaciones', 'temporada']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener los talleres')
      }
    })
  }

  static async obtenerTicketsEstado ({ estado, logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await SolicitudServicio.findAll({
          where: {
            estado
          },
          attributes: ['id', 'fecha', 'no_economico', 'centro_coste', 'prioridad', 'mantenimiento', 'taller_asignado', 'reparacion_solicitada', 'responsable', 'kilometraje', 'fecha_salida', 'estado', 'observaciones', 'temporada']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener los talleres')
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await SolicitudServicio.findAll({
          where: filtros,
          attributes: ['id', 'nombre', 'email', 'rol']
        })

        if (usuarios.length === 0) {
          throw new NotFoundError('No se encontraron usuarios')
        }

        return usuarios
      } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al buscar usuarios')
      }
    })
  }

  static async actualizarUsuario (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const usuario = await SolicitudServicio.findByPk(id)
      if (!usuario) throw new NotFoundError('Usuario no encontrado')

      await usuario.update(datos, { transaction })
      return usuario
    })
  }
}

// Ejemplo de uso:
/*
// Crear usuario
const nuevoUsuario = await EjemploModel.crearUsuario({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  rol: 'usuario'
})

// Buscar usuarios
const usuarios = await EjemploModel.buscarUsuarios({
  rol: 'admin'
})

// Actualizar usuario
const usuarioActualizado = await EjemploModel.actualizarUsuario(1, {
  nombre: 'Juan Modificado'
})
*/

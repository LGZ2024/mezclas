import { Notificaciones } from '../schema/notificaciones.js'
// utils
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
export class NotificacionModel {
  // uso
  static async create ({ idSolicitud, mensaje, idUsuario }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!idSolicitud || !mensaje || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // creamos el notificacion
      await Notificaciones.create({ id_solicitud: idSolicitud, mensaje, id_usuario: idUsuario })
      return { message: `notificacion registrado exitosamente ${idSolicitud}` }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al crear la notificacion')
    }
  }

  // uso
  static async getAllIdUsuario ({ idUsuario }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(idUsuario)) throw new ValidationError('El id debe ser un numero')

      const notificacion = await Notificaciones.findAll({
        where: {
          id_usuario: idUsuario,
          status: 1
        },
        attributes: [
          'id',
          'id_solicitud',
          'id_usuario',
          'mensaje',
          'status'
        ]
      })
      if (!notificacion) throw new NotFoundError('notificaciones no encontradas')

      return notificacion
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las notificaciones')
    }
  }

  static async getOneIDSolicitudUsuario ({ idUsuario, idSolicitud }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(idUsuario) || isNaN(idSolicitud)) throw new ValidationError('No se proporciono el id de usuario o la solicitud')

      const notificacion = await Notificaciones.findAll({
        where: {
          id_solicitud: idSolicitud,
          id_usuario: idUsuario,
          status: 1
        },
        attributes: [
          'id',
          'id_solicitud',
          'id_usuario',
          'mensaje',
          'status'
        ]
      })
      if (!notificacion) throw new NotFoundError('notificacion no encontrada')

      return notificacion
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las notificacion')
    }
  }

  // uso
  static async updateStatus ({ id }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      const notificacion = await Notificaciones.findByPk(id)
      if (!notificacion) throw new NotFoundError('notificacion con id ' + id + ' no encontrada')
      // Actualiza solo los campos que se han proporcionado
      if (id) notificacion.status = 0
      await notificacion.save()

      return { message: 'Notificacion actualizada correctamente' }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar la notificacion')
    }
  }
}

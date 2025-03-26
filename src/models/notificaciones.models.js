import { Notificaciones } from '../schema/notificaciones.js'

export class NotificacionModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const notificacion = await Notificaciones.findAll()
      return notificacion
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al obtener los viviendas' }
    }
  }

  static async getAllIdUsuario ({ idUsuario }) {
    try {
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
      return notificacion
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al obtener los viviendas' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const notificacion = await Notificaciones.findByPk(id)
      return notificacion || { error: 'Notificacion no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al obtener al notificacion' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const notificacion = await Notificaciones.findByPk(id)
      if (!notificacion) return { error: 'notificacion no encontrado' }

      await notificacion.destroy()
      return { message: `notificacion eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al elimiar el notificacion' }
    }
  }

  static async create ({ idSolicitud, mensaje, idUsuario }) {
    try {
      // creamos el notificacion
      await Notificaciones.create({ id_solicitud: idSolicitud, mensaje, id_usuario: idUsuario })
      return { message: `notificacion registrado exitosamente ${idSolicitud}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al crear al notificacion' }
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const notificacion = await Notificaciones.findByPk(id)
      if (!notificacion) return { error: 'notificacion no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) notificacion.nombre = data.nombre
      if (data.descripcion) notificacion.descripcion = data.descripcion
      if (data.ubicacion) notificacion.ubicacion = data.ubicacion

      await notificacion.save()

      return { message: 'usuario actualizada correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al obtener las viviendas' }
    }
  }

  // para actualizar status de notificacion
  static async updateStatus ({ id }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const notificacion = await Notificaciones.findByPk(id)
      if (!notificacion) return { error: 'notificacion no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (id) notificacion.status = 0
      await notificacion.save()

      return { message: 'notificacion actualizada correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la notificacion
      return { error: 'Error al obtener las status de notificacion' }
    }
  }
}

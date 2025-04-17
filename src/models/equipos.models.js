import { Equipos } from '../schema/equipos.js'
// utils
import { DatabaseError, CustomError, NotFoundError, ValidationError } from '../utils/CustomError.js'
export class EquiposModel {
  // uso
  static async getAllDisponible () {
    try {
      const equipo = await Equipos.findAll({
        where: {
          status: 'disponible'
        },
        attributes: ['id', 'ns']
      })
      if (!equipo) throw new NotFoundError('Equipos de coste no encontrados')
      return equipo
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los equipos')
    }
  }

  static async actualizarEquipo ({ id, estado }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      const equipo = await Equipos.findByPk(id)
      if (!equipo) throw new NotFoundError('Equipo no encontrado')
      // Actualiza solo los campos que se han proporcionado
      if (estado) equipo.estado = estado
      await equipo.save()
      return { message: 'Equipo actualizado correctamente', id }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar equipo')
    }
  }

  static async delete ({ id }) {
    try {
      const usuario = await Equipos.findByPk(id)
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
      const usuario = await Equipos.findOne({ where: { usuario: data.usuario } })
      if (usuario) return { error: 'usuario ya existe' }
      // creamos el usuario
      await Equipos.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al crear al usuario' }
    }
  }
}

import { Vivienda } from '../schema/vivienda.js'

export class ViviendaModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const vivienda = await Vivienda.findAll()
      return vivienda
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al obtener los viviendas' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const vivienda = await Vivienda.findByPk(id)
      return vivienda || { error: 'vivienda no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al obtener al vivienda' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const vivienda = await Vivienda.findByPk(id)
      if (!vivienda) return { error: 'vivienda no encontrado' }

      await vivienda.destroy()
      return { message: `vivienda eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al elimiar el vivienda' }
    }
  }

  // crear usuario
  static async create ({ data }) {
    try {
      // verificamos que no exista el usuario
      const vivienda = await Vivienda.findOne({ where: { nombre: data.nombre } })
      if (vivienda) return { error: 'vivienda ya existe' }
      // creamos el vivienda
      await Vivienda.create({ ...data })
      return { message: `vivienda registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al crear al vivienda' }
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const vivienda = await Vivienda.findByPk(id)
      if (!vivienda) return { error: 'vivienda no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) vivienda.nombre = data.nombre
      if (data.descripcion) vivienda.descripcion = data.descripcion
      if (data.ubicacion) vivienda.ubicacion = data.ubicacion

      await vivienda.save()

      return { message: 'usuario actualizada correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al obtener las viviendas' }
    }
  }
}

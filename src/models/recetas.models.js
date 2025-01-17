import { Recetas } from '../schema/recetas.js'

export class RecetasModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const recetas = await Recetas.findAll({
        attributes: ['id_receta', 'nombre', 'descripcion', 'unidad_medida']
      })
      return recetas
    } catch (e) {
      console.error(e.message) // Salida: Error la recetas
      return { error: 'Error al obtener los recetas' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const recetas = await Recetas.findByPk(id)
      return recetas || { error: 'recetas no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la recetas
      return { error: 'Error al obtener al recetas' }
    }
  }

  // eliminar recetas
  static async delete ({ id }) {
    try {
      const recetas = await Recetas.findByPk(id)
      if (!recetas) return { error: 'recetas no encontrado' }

      await recetas.destroy()
      return { message: `recetas eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la recetas
      return { error: 'Error al elimiar el recetas' }
    }
  }

  // crear recetas
  static async create ({ data }) {
    try {
      // verificamos que no exista el recetas
      const recetas = await Recetas.findOne({ where: { recetas: data.recetas } })
      if (recetas) return { error: 'recetas ya existe' }
      // creamos el recetas
      await Recetas.create({ ...data })
      return { message: `recetas registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la recetas
      return { error: 'Error al crear al recetas' }
    }
  }

  // para actualizar datos de recetas
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const recetas = await Recetas.findByPk(id)
      if (!recetas) return { error: 'recetas no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) recetas.nombre = data.nombre
      if (data.email) recetas.email = data.email
      if (data.rol) recetas.rol = data.rol
      if (data.empresa) recetas.empresa = data.empresa

      await recetas.save()

      return { message: 'recetas actualizada correctamente', rol: data.rol }
    } catch (e) {
      console.error(e.message) // Salida: Error la recetas
      return { error: 'Error al obtener las recetass' }
    }
  }
}

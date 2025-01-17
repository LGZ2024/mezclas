import { Productos } from '../schema/productos.js'

export class ProductosModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const productos = await Productos.findAll({
        attributes: ['id_producto', 'nombre', 'descripcion', 'unidad_medida']
      })
      return productos
    } catch (e) {
      console.error(e.message) // Salida: Error la productos
      return { error: 'Error al obtener los productos' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const usuario = await Productos.findByPk(id)
      return usuario || { error: 'usuario no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener al usuario' }
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getCentrosPorRancho ({ rancho }) {
    try {
      const centros = await Productos.findAll({
        where: {
          rancho
        },
        attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
      })

      return centros.length > 0 ? centros : { message: 'No se encontraron centros de coste para este rancho' }
    } catch (e) {
      console.error(e.message) // Salida: Error al obtener los centros de coste
      return { error: 'Error al obtener los centros de coste' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const usuario = await Productos.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }

      await usuario.destroy()
      return { message: `usuario eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al elimiar el usuario' }
    }
  }

  // crear usuario
  static async create ({ data }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Productos.findOne({ where: { usuario: data.usuario } })
      if (usuario) return { error: 'usuario ya existe' }
      // creamos el usuario
      await Productos.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al crear al usuario' }
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Productos.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre
      if (data.email) usuario.email = data.email
      if (data.rol) usuario.rol = data.rol
      if (data.empresa) usuario.empresa = data.empresa

      await usuario.save()

      return { message: 'usuario actualizada correctamente', rol: data.rol }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener las usuarios' }
    }
  }
}

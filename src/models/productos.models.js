import logger from '../utils/logger.js'
import { Productos } from '../schema/productos.js'
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'

export class ProductosModel {
  // uso
  static async getAll () {
    try {
      const productos = await Productos.findAll({
        attributes: ['id_producto', 'nombre', 'descripcion', 'unidad_medida']
      })

      if (!productos) throw new NotFoundError('productos no encontrados')

      return productos
    } catch (error) {
      throw new DatabaseError('Error al obtener los productos')
    }
  }

  static async getOne ({ id }) {
    try {
      const producto = await Productos.findByPk(id)
      if (!producto) {
        throw new NotFoundError(`Producto con ID ${id} no encontrado`)
      }
      return producto
    } catch (error) {
      logger.error(`Productos.model Error al obtener el producto: ${error.message}`)
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener el producto')
    }
  }

  static async delete ({ id }) {
    try {
      const producto = await Productos.findByPk(id)

      if (!producto) {
        throw new NotFoundError(`Producto con ID ${id} no encontrado`)
      }

      await producto.destroy()

      return { message: `producto eliminada correctamente con id ${id}` }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al eliminar el producto')
    }
  }

  // crear producto
  static async create ({ data }) {
    try {
      // verificamos que no exista el producto
      const producto = await Productos.findOne({ where: { producto: data.producto } })

      if (producto) throw new ValidationError('Producto ya existe')

      // creamos el producto
      await Productos.create({ ...data })
      return { message: `Producto registrado exitosamente ${data.nombre}` }
    } catch (e) {
      logger.error({
        message: 'Error al crear producto',
        error: e.message,
        stack: e.stack,
        method: 'ProductosModel.create'
      })
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al crear el producto')
    }
  }

  // para actualizar datos de producto
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const producto = await Productos.findByPk(id)
      if (!producto) throw new NotFoundError(`Producto con ID ${id} no encontrado`)
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) producto.nombre = data.nombre
      if (data.email) producto.email = data.email
      if (data.rol) producto.rol = data.rol
      if (data.empresa) producto.empresa = data.empresa

      await producto.save()

      return { message: 'producto actualizada correctamente', rol: data.rol }
    } catch (e) {
      logger.error({
        message: 'Error al actualizar producto',
        error: e.message,
        stack: e.stack,
        method: 'ProductosModel.update'
      })
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar el producto')
    }
  }
}

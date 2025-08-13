import logger from '../utils/logger.js'
import { Productos } from '../schema/productos.js'
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
import { DbHelper } from '../utils/dbHelper.js'
import { Op } from 'sequelize'
export class ProductosModel {
  // uso
  static async getAll () {
    try {
      const productos = await Productos.findAll({
        attributes: ['id_producto', 'id_sap', 'nombre', 'descripcion', 'unidad_medida']
      })

      if (!productos) throw new NotFoundError('productos no encontrados')

      return productos
    } catch (error) {
      throw new DatabaseError('Error al obtener los productos')
    }
  }

  static async getOne ({ id }) {
    try {
      const producto = await Productos.findOne({
        where: { id_producto: id },
        attributes: ['id_producto', 'id_sap', 'nombre', 'descripcion', 'unidad_medida']
      })
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

  static async delete ({ id, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        const producto = await Productos.findByPk(id)
        console.log('producto', producto)
        if (!producto) {
          throw new NotFoundError(`Producto con ID ${id} no encontrado`)
        }

        await producto.destroy({ transaction })

        return { message: `Producto eliminada correctamente con id ${id}` }
      } catch (error) {
        logger.error('Error al eliminar el producto:', {
          ...logContext,
          error: error.message,
          id
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al eliminar el producto')
      }
    })
  }

  // crear producto
  static async create ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        const existingProduct = await Productos.findOne({
          where: {
            [Op.or]: [
              { id_sap: datos.id_sap },
              { nombre: datos.nombre }
            ]
          },
          transaction
        })
        if (existingProduct) {
          const duplicateField = existingProduct.id_sap === datos.id_sap ? 'ID SAP' : 'nombre'
          logger.warn({
            message: 'Intento de crear producto duplicado',
            existingProduct: {
              id: existingProduct.id_producto,
              field: duplicateField
            },
            attemptedData: datos,
            context: logContext
          })
          throw new ValidationError(`Ya existe un producto con el mismo ${duplicateField}`)
        }

        await Productos.create(datos, { transaction })

        return { message: 'Entrada registrada correctamente' }
      } catch (error) {
        logger.error('Error al registrar entrada de combustible:', {
          ...logContext,
          error: error.message,
          datos
        })
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al crear el producto')
      }
    })
  }

  // para actualizar datos de producto
  static async update ({ id, datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      if (!id) {
        throw new ValidationError('El ID del producto es requerido para actualizar')
      }
      try {
      // verificamos si existe alguna empresa con el id proporcionado
        const producto = await Productos.findByPk(id)

        if (!producto) throw new NotFoundError(`Producto con ID ${id} no encontrado`)
        // Actualiza solo los campos que se han proporcionado
        if (datos.nombre) producto.nombre = datos.nombre
        if (datos.id_sap) producto.id_sap = datos.id_sap
        if (datos.descripcion) producto.descripcion = datos.descripcion
        if (datos.unidad_medida) producto.unidad_medida = datos.unidad_medida

        await producto.save({ transaction })

        return { message: `Producto con ID ${id} actualizada correctamente` }
      } catch (e) {
        logger.error({
          message: 'Error al actualizar producto',
          error: e.message,
          stack: e.stack,
          context: {
            ...logContext
          }
        })
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al actualizar el producto')
      }
    })
  }
}

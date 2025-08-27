import { DbHelper } from '../utils/dbHelper.js'
import { CombustibleEntrada } from '../schema/combustible_entrada.js'
import { Centrocoste } from '../schema/centro.js'
import { CombustibleInventario } from '../schema/combustible_inventario.js'
import { NotFoundError, ValidationError, DatabaseError } from '../utils/CustomError.js'

export class EntradaCombustibleModel {
  static async agregarEntradaCombustible ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        const inventario = await CombustibleInventario.findOne({
          where: { almacen: datos.almacen, combustible: datos.combustible }
        })

        if (!inventario) {
          throw new NotFoundError('No se encontró el almacén o tipo de combustible en el inventario')
        }

        await CombustibleEntrada.create(datos, { transaction })
        // realizar suma de numeros
        const existencia = Number(inventario.existencia) || 0
        const cantidad = Number(datos.cantidad) || 0
        const suma = existencia + cantidad
        inventario.existencia = suma.toString()

        await inventario.save({ transaction })

        return { message: 'Entrada registrada correctamente' }
      } catch (error) {
        logger.error('Error al registrar entrada de combustible:', {
          ...logContext,
          error: error.message,
          datos
        })
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al registrar entrada de combustible')
      }
    })
  }

  static async obtenerEntradasCombustibles ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.info('Iniciando Modelo Obtener Entradas Combustibles', logContext)
        const entradas = await CombustibleEntrada.findAll({
          include: [
            {
              model: Centrocoste,
              attributes: ['id', 'cc', 'empresa']
            }
          ],
          attributes: ['id', 'factura', 'fecha', 'combustible', 'almacen', 'cantidad', 'proveedor', 'traslada', 'recibe', 'comentario', 'pedido']
        })
        const resultadosFormateados = entradas.map(servicios => {
          const m = servicios.toJSON()
          return {
            id: m.id,
            factura: m.factura,
            fecha: m.fecha,
            combustible: m.combustible,
            almacen: m.almacen,
            cantidad: m.cantidad,
            proveedor: m.proveedor,
            traslada: m.traslada,
            recibe: m.recibe,
            comentario: m.comentario || 'N/A',
            pedido: m.pedido,
            centro_coste: m.centrocoste?.cc || 'N/A', // Acceder usando el alias
            empresa: m.centrocoste?.empresa || 'N/A'
          }
        })
        const uniqueData = Array.from(
          new Map(resultadosFormateados.map(item => [item.id, item])).values()
        )
        logger.info('Finalizando Modelo Obtener Entradas Combustibles', logContext)
        return uniqueData
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar entrada de combustible:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await CombustibleEntrada.findAll({
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
      const usuario = await CombustibleEntrada.findByPk(id)
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

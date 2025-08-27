import { DbHelper } from '../utils/dbHelper.js'
import { CombustibleSalida } from '../schema/combustible_salida.js'
import { Centrocoste } from '../schema/centro.js'
import { CombustibleInventario } from '../schema/combustible_inventario.js'
import { NotFoundError, ValidationError, DatabaseError } from '../utils/CustomError.js'

export class SalidaCombustibleModel {
  static async agregarSalidaCombustible ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        const inventario = await CombustibleInventario.findOne({
          where: { almacen: datos.almacen, combustible: datos.combustible }
        })

        if (!inventario) {
          throw new NotFoundError(`No se encontró el almacén ${datos.almacen} o tipo de combustible ${datos.combustible} en el inventario`)
        }
        // validamos exixtencia con la cantidad solicitada
        if (Number(inventario.existencia) < Number(datos.cantidad)) {
          throw new ValidationError(`La cantidad solicitada ${datos.cantidad}. Es mayor a la existencia en el inventario: ${inventario.existencia}`)
        }

        await CombustibleSalida.create(datos, { transaction })
        // realizar resta de numeros
        const existencia = Number(inventario.existencia) || 0
        const cantidad = Number(datos.cantidad) || 0
        const resta = existencia - cantidad
        inventario.existencia = resta.toString()

        await inventario.save({ transaction })

        return { message: 'Salida de combustible registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar salida de combustible:', {
          ...logContext,
          error: error.message,
          datos
        })
        throw error
      }
    })
  }

  static async SalidaCombustible ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.info('Iniciando Modelo Obtener Salidas Combustibles', logContext)
        const salidas = await CombustibleSalida.findAll({
          include: [
            {
              model: Centrocoste,
              attributes: ['id', 'cc', 'empresa']
            }
          ],
          attributes: ['id', 'fecha', 'combustible', 'centro_coste', 'almacen', 'cantidad', 'responsable', 'no_economico', 'comentario', 'temporada', 'actividad']
        })
        const resultadosFormateados = salidas.map(servicios => {
          const m = servicios.toJSON()
          return {
            id: m.id,
            fecha: m.fecha,
            combustible: m.combustible,
            almacen: m.almacen,
            id_centrosa: m.centro_coste || 'N/A',
            centro_id: m.centrocoste?.id || 'N/A', // Acceder usando el alias
            centro_coste: m.centrocoste?.cc || 'N/A', // Acceder usando el alias
            empresa: m.centrocoste?.empresa || 'N/A',
            cantidad: m.cantidad,
            responsable: m.responsable,
            no_economico: m.no_economico,
            comentario: m.comentario,
            temporada: m.temporada,
            actividad: m.actividad
          }
        })
        const uniqueData = Array.from(
          new Map(resultadosFormateados.map(item => [item.id, item])).values()
        )
        logger.info('Finalizando Modelo Obtener Salidas Combustibles', logContext)
        return uniqueData
      } catch (error) {
        logger.error('Error al obtener salidas de combustible', {
          ...logContext,
          error: error.message
        })
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al buscar Salidas de combustible')
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await CombustibleSalida.findAll({
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
      const usuario = await CombustibleSalida.findByPk(id)
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

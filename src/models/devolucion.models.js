// esquemas
import { Devoluciones } from '../schema/devoluciones.js'
import { Usuario } from '../schema/usuarios.js'
// utils
import { DatabaseError, CustomError, ValidationError } from '../utils/CustomError.js'
import { DbHelper } from '../utils/dbHelper.js'
// modelos
import { UsuarioModel } from './usuario.models.js'

export class DevolucionModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const vivienda = await Devoluciones.findAll()
      return vivienda
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al obtener los viviendas' }
    }
  }

  // obtener datos de devolucion
  static async getAllDevoluciones ({ status, logger, logContext }) {
    try {
      logger.info()
      const devoluciones = await Devoluciones.findAll({
        where: {
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          }
        ],
        attributes: [
          'idDevolucion',
          'empresa',
          'almacen',
          'temporada',
          'descripcion',
          'fechaDevolucion',
          'status'
        ]
      })
      // Transformar los resultados
      const resultadosFormateados = devoluciones.map(productos => {
        const m = productos.toJSON()
        return {
          idDevolucion: m.idDevolucion,
          empresa: m.empresa,
          status: m.status,
          almacen: m.almacen,
          temporada: m.temporada,
          descripcion: m.descripcion,
          fechaDevolucion: m.fechaDevolucion,
          usuario: m.usuario.nombre
        }
      })
      // Verifica si hay duplicados
      const uniqueData = Array.from(
        new Map(resultadosFormateados.map(item => [item.idDevolucion, item])).values()
      )
      logger.debug('resultados sin duplicados', uniqueData)

      return uniqueData || []
    } catch (error) {
      logger.error(`Devolucion.model Error al obtener devoluciones: ${error.message}`)
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener el devoluciones')
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const vivienda = await Devoluciones.findByPk(id)
      return vivienda || { error: 'vivienda no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al obtener al vivienda' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const vivienda = await Devoluciones.findByPk(id)
      if (!vivienda) return { error: 'vivienda no encontrado' }

      await vivienda.destroy()
      return { message: `vivienda eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la vivienda
      return { error: 'Error al elimiar el vivienda' }
    }
  }

  // crear devolucion
  static async registrarDevolucion ({ data, idUsuarioSolicita, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logModelOperation('REGISTRO_DEVOLUCION_modelo', ' Iniciando', logContext)
        // creamos id de devolucion unico para que se aconsistente y utlizarlos en todos lo productos de la solicitud y sea unico
        const idDevolucion = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        // Extraer empresa del almacén
        const empresa = data.almacen.match(/\((.*?)\)/)?.[1] || ''
        // Crear devoluciones para cada producto
        const devoluciones = await Promise.all(data.productos.map(producto =>
          Devoluciones.create({
            idDevolucion,
            idUsuarioSolicita,
            empresa,
            almacen: data.almacen,
            temporada: data.temporada,
            descripcion: data.descripcion,
            fechaDevolucion: new Date().toISOString(),
            producto: producto.id_producto,
            cantidad: producto.cantidad,
            unidad: producto.unidad_medida
          }, { transaction })
        ))

        logger.logOperation('REGISTRO_DEVOLUCION_modelo', 'Finalizado', logContext)

        return {
          message: 'Devoluciones registradas exitosamente',
          empresa,
          ids: devoluciones.map(d => d.id)
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al crear la devolución', {
          context: {
            name: logContext.name,
            operation: logContext.operation,
            requestData: logContext.requestData
          }
        })
      }
    })
  }

  static async determinarDestinatarios ({ almacen, logger }) {
    return await DbHelper.executeQuery(async () => {
      let ress = []
      try {
        if (almacen === 'Almacen Casas Altos (Moras Finas)') {
          const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa: 'Moras Finas' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r3]
        } else if (almacen === 'Almacen Ojo de Agua (Bayas del Centro)') {
          const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa: 'Bayas del Centro' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r3]
        } else if (almacen === 'Almacen Ahualulco (Bioagricultura)') {
          const r3 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: 'Bioagricultura', rancho: 'Ahualulco' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r3]
        } else if (almacen === 'Almacen Atemajac (Bioagricultura)') {
          const r3 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: 'Bioagricultura', rancho: 'Atemajac' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r3]
        }
        return { ress } || []
      } catch (error) {
        logger.error('Error al determinar destinatarios de notificación', {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        })
        if (error instanceof CustomError) throw error
        throw new ValidationError('Error al buscar destinatarios')
      }
    })
  }

  // para actualizar los datos de una devolucion
  static async update ({ id, data, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
      // verificamos si existe alguna empresa con el id proporcionado
        const vivienda = await Devoluciones.findByPk(id)
        if (!vivienda) return { error: 'vivienda no encontrado' }
        // Actualiza solo los campos que se han proporcionado
        if (data.nombre) vivienda.nombre = data.nombre
        if (data.descripcion) vivienda.descripcion = data.descripcion
        if (data.ubicacion) vivienda.ubicacion = data.ubicacion

        await vivienda.save({ transaction })

        return { message: 'usuario actualizada correctamente' }
      } catch (error) {
        logger.error('Error al determinar destinatarios de notificación', {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        })
        if (error instanceof CustomError) throw error
        throw new ValidationError('Error al buscar destinatarios')
      }
    })
  }

  // Actualizar estado de devolucion
  static async updateEstado ({ id, data, idUsuarioSolicita, ranchos }) {
    try {
      const devolucion = await Devoluciones.findByPk(id)
      if (!devolucion) return { error: 'devolucion no encontrada' }

      devolucion.estado = data.estado || devolucion.estado

      await devolucion.save()

      return { message: 'devolucion actualizada correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la devolucion
      return { error: 'Error al obtener las devoluciones' }
    }
  }
}

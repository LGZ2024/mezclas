import { DbHelper } from '../utils/dbHelper.js'
import { Mantenimientos } from '../schema/mantenimiento.js'
import { unidad } from '../schema/catalogo_unidad.js'
import { CatalogoTaller } from '../schema/catalogo_taller.js'
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  CustomError
} from '../utils/CustomError.js'

export class MantenimientosModel {
  static async agregarMantenimiento ({ data, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar data
        if (!data) {
          throw new ValidationError('La informacion de Mantenimientos es requerida')
        }
        // Crear usuario dentro de una transacción
        const Mantenimiento = await Mantenimientos.create({ ...data }, { transaction })

        logger.info('Mantenimientos creado exitosamente', {
          id: Mantenimiento.id,
          no_economico: Mantenimiento.no_economico
        })

        return { message: 'Mantenimientos registrada correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al crear Mantenimientos', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async obtenerMantenimientos ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const Mantenimiento = await Mantenimientos.findAll({
          include: [{
            model: unidad,
            attributes: ['id', 'no_economico']
          },
          {
            model: CatalogoTaller,
            attributes: ['id', 'razon_social']
          }],
          attributes: ['id', 'fecha', 'tipo_servicio', 'detalles', 'prioridad', 'fecha_salida', 'responsable', 'centros_coste', 'tipo_vehiculo', 'kilometraje', 'precio', 'tipo_pago', 'factura', 'estado', 'comentario']
        })
        // Transformar los resultados
        const resultadosFormateados = Mantenimiento.map(mantenimientos => {
          const m = mantenimientos.toJSON()
          return {
            id: m.id,
            fecha: m.fecha,
            tipo_servicio: m.tipo_servicio,
            detalles: m.detalles,
            prioridad: m.prioridad,
            fecha_salida: m.fecha_salida,
            responsable: m.responsable,
            centros_coste: m.centros_coste,
            tipo_vehiculo: m.tipo_vehiculo,
            kilometraje: m.kilometraje,
            precio: m.precio,
            tipo_pago: m.tipo_pago,
            factura: m.factura,
            estado: m.estado,
            comentario: m.comentario,
            no_economico: m.catalogo_unidad.no_economico,
            taller_asignado: m.CatalogoTaller.razon_social
          }
        })
        // Verifica si hay duplicados
        const uniqueData = Array.from(
          new Map(resultadosFormateados.map(item => [item.id, item])).values()
        )
        return uniqueData || []
      } catch (error) {
        console.log(error)
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener Mantenimiento')
      }
    })
  }

  static async obtenerMantenimientoTipoServicio ({ tipoServicio, logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const Mantenimiento = await Mantenimientos.findAll({
          where: { tipo_servicio: tipoServicio },
          include: [{
            model: unidad,
            attributes: ['id', 'no_economico']
          },
          {
            model: CatalogoTaller,
            attributes: ['id', 'razon_social']
          }],
          attributes: ['id', 'fecha', 'tipo_servicio', 'detalles', 'prioridad', 'fecha_salida', 'responsable', 'centros_coste', 'tipo_vehiculo', 'kilometraje', 'precio', 'tipo_pago', 'factura', 'estado', 'comentario']

        })
        // Transformar los resultados
        const resultadosFormateados = Mantenimiento.map(mantenimientos => {
          const m = mantenimientos.toJSON()
          return {
            id: m.id,
            fecha: m.fecha,
            tipo_servicio: m.tipo_servicio,
            detalles: m.detalles,
            prioridad: m.prioridad,
            fecha_salida: m.fecha_salida,
            responsable: m.responsable,
            centros_coste: m.centros_coste,
            tipo_vehiculo: m.tipo_vehiculo,
            kilometraje: m.kilometraje,
            precio: m.precio,
            tipo_pago: m.tipo_pago,
            factura: m.factura,
            estado: m.estado,
            comentario: m.comentario,
            no_economico: m.catalogo_unidad.no_economico,
            taller_asignado: m.CatalogoTaller.razon_social
          }
        })
        // Verifica si hay duplicados
        const uniqueData = Array.from(
          new Map(resultadosFormateados.map(item => [item.id, item])).values()
        )
        return uniqueData || []
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener Mantenimiento')
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await Mantenimientos.findAll({
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
      const usuario = await Mantenimientos.findByPk(id)
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

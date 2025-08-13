import { DbHelper } from '../utils/dbHelper.js'
import { unidad } from '../schema/catalogo_unidad.js'
import { unidadCombustible } from '../schema/catalogo_unidad_combustible.js'
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  CustomError
} from '../utils/CustomError.js'

export class UnidadModel {
  static async crearUnidad ({ data, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar data
        if (!data) {
          throw new ValidationError('La informacion de unidad es requerida')
        }
        console.log(data)
        // Crear usuario dentro de una transacción
        const unidades = await unidad.create({ no_economico: data.no_economico, marca: data.marca, tipo: data.tipo, modelo: data.modelo, ano: data.ano, numero_motor: data.numero_motor, no_serie: data.no_serie, placas: data.placas, tipoCombustible: data.tipoCombustible, medida_llanta: data.medida_llanta, cia_seguro: data.cia_seguro, no_poliza: data.no_poliza }, { transaction })

        logger.info('Unidad creado exitosamente', {
          id: unidades.id,
          no_economico: unidades.no_economico,
          marca: unidades.marca
        })

        return { message: 'Unidad registrada correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al crear unidad', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async obtenerUnidades ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await unidad.findAll({
          attributes: ['id', 'no_economico', 'marca', 'tipo', 'modelo', 'ano', 'numero_motor', 'no_serie', 'placas', 'tipoCombustible', 'medida_llanta', 'cia_seguro', 'no_poliza']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener unidades')
      }
    })
  }

  static async obtenerUnidad ({ id, logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await unidad.findAll({
          where: { id },
          attributes: ['id', 'tipo']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener unidades')
      }
    })
  }

  // este funcion del modelo ingresa a la tabla de catalogo_unidad_combustible
  static async obtenerUnidadesCombustibles ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await unidadCombustible.findAll({
          attributes: ['id', 'no_economico', 'km', 'fecha', 'usuario_registra']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener unidades')
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await unidad.findAll({
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
      const usuario = await unidad.findByPk(id)
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

import { DbHelper } from '../utils/dbHelper.js'
import { CatalogoTaller } from '../schema/catalogo_taller.js'
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  CustomError
} from '../utils/CustomError.js'

export class TallerModel {
  static async crearTaller ({ data, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar data
        if (!data) {
          throw new ValidationError('La informacion del taller es requerida')
        }
        console.log(data)
        // Crear usuario dentro de una transacción
        const unidades = await CatalogoTaller.create({ ...data }, { transaction })

        logger.info('Taller creado exitosamente', {
          id: unidades.id,
          no_economico: unidades.no_economico,
          marca: unidades.marca
        })

        return { message: 'Taller Registrado correctamente' }
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

  static async obtenerTaller ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const unidades = await CatalogoTaller.findAll({
          attributes: ['id', 'razon_social', 'domicilio', 'contacto', 'tipo_pago']
        })
        return unidades
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al obtener los talleres')
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await CatalogoTaller.findAll({
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
      const usuario = await CatalogoTaller.findByPk(id)
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

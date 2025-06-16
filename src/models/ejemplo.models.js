import { DbHelper } from '../utils/dbHelper.js'
import { Usuario } from '../schema/usuarios.js'
import { NotFoundError, ValidationError, DatabaseError } from '../utils/CustomError.js'
import logger from '../utils/logger.js'

export class EjemploModel {
  static async crearUsuario (datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar datos
        if (!datos.nombre || !datos.email) {
          throw new ValidationError('Nombre y email son requeridos')
        }

        // Crear usuario dentro de una transacción
        const usuario = await Usuario.create(datos, { transaction })

        logger.info('Usuario creado exitosamente', {
          userId: usuario.id,
          email: usuario.email
        })

        return usuario
      } catch (error) {
        logger.error('Error al crear usuario:', {
          error: error.message,
          datos
        })
        throw error
      }
    })
  }

  static async buscarUsuarios (filtros) {
    return await DbHelper.executeQuery(async () => {
      try {
        const usuarios = await Usuario.findAll({
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
      const usuario = await Usuario.findByPk(id)
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

import { Usuario } from '../schema/usuarios.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { envs } from '../config/env.mjs'
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
import logger from '../utils/logger.js'
import { DbHelper } from '../utils/dbHelper.js'
/**
Los operadores de Sequelize (Op) son necesarios para realizar consultas complejas. Algunos operadores comunes son:
Op.eq: Igual
Op.ne: No igual
Op.gt: Mayor que
Op.lt: Menor que
Op.in: Dentro de un array
Op.like: Búsqueda con comodín
 */
export class UsuarioModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['id', 'nombre', 'usuario', 'email', 'rol', 'empresa', 'ranchos', 'variedad']
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async getUsuarios ({ nombre, rol, empresa }) {
    const logContext = {
      operation: 'getUsuarios Model',
      nombre,
      rol,
      empresa,
      timestamp: new Date().toISOString()
    }
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!nombre || !rol || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }

      // Filtrar por empresa y rancho no nulo
      if (empresa === 'Bioagricultura' && rol === 'adminMezclador') {
        const usuario = await Usuario.findAll({
          attributes: ['id', 'nombre', 'rol', 'empresa', 'ranchos'],
          where: {
            empresa,
            rol: { [Op.in]: ['solicita', 'solicita2'] }, // Filtrar por rol
            ranchos: { [Op.ne]: 'Ahualulco' } // Filtrar por rancho no nulo
          }
        })
        // Verificar si se encontraron resultados
        if (usuario.length === 0) {
          throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
        }
        return usuario
      } else if (empresa === 'General' && rol === 'adminMezclador') {
        const usuario = await Usuario.findAll({
          attributes: ['id', 'nombre', 'rol', 'empresa', 'ranchos'],
          where: {
            empresa,
            rol: { [Op.in]: ['solicita', 'solicita2'] }, // Filtrar por rol
            ranchos: { [Op.eq]: 'Ahualulco' } // Filtrar por rancho no nulo
          }
        })
        // Verificar si se encontraron resultados
        if (usuario.length === 0) {
          throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
        }
        return usuario
      }
      return { message: 'No se encontraron usuarios para los criterios especificados' }
    } catch (e) {
      logger.logError(e, {
        ...logContext,
        stack: e.stack
      })
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios', {
        originalError: e.message,
        context: logContext
      })
    }
  }

  // uso
  static async getUserEmail ({ rol, empresa }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          [Op.or]: [
            { empresa },
            { empresa: 'General' }
          ]
        }
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  // uso
  static async getUserEmailRancho ({ rol, empresa, rancho }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa || !rancho) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          empresa, // Se filtra por empresa
          ranchos: rancho // Se filtra por rancho
        }
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async getUserEmailRanchoRol ({ rol, rancho }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !rancho) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          ranchos: rancho // Se filtra por rancho
        }
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async getUserEmailGerente ({ rol, idUsuario }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          id: idUsuario // Se filtra por rancho
        }
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  // uso
  static async getUserEmailEmpresa ({ rol, empresa }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          empresa // Se filtra por empresa
        }
      })
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ rol, empresa }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findOne({
        where: { rol, empresa },
        attributes: ['nombre', 'email', 'rol']
      })
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }
      return usuario
    } catch (error) {
      logger.error('Error al determinar destinatarios de notificación', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async getOneId ({ id }) {
    try {
      if (!id) {
        throw new ValidationError('ID no proporcionados')
      }
      const usuario = await Usuario.findOne({
        where: { id },
        attributes: ['nombre', 'email', 'rol', 'empresa']
      })
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new NotFoundError('No se encontro usuario')
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id) throw new ValidationError('Datos requeridos no proporcionados')

      const usuario = await Usuario.findByPk(id)

      if (!usuario) throw new NotFoundError('Usuario no encontrado')

      await usuario.destroy()
      return { message: `usuario eliminada correctamente con id ${id}` }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al eliminar usuario')
    }
  }

  // crear usuario
  static async create ({ data }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!data.usuario || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // verificamos que no exista el usuario
      const usuario = await Usuario.findOne({ where: { usuario: data.usuario, email: data.email } })
      if (usuario) throw new ValidationError('El usuario o email ya existe')
      // creamos el usuario
      await Usuario.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al crear usuario')
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id || !data.nombre || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Usuario.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre
      if (data.email) usuario.email = data.email
      if (data.rol) usuario.rol = data.rol
      if (data.empresa) usuario.empresa = data.empresa

      await usuario.save()

      return { message: 'usuario actualizada correctamente', rol: data.rol }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar usuario')
    }
  }

  // funcion login
  static async login ({ user, password, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      try {
      // Verificar si se proporcionaron los parámetros requeridos
        if (!user || !password) {
          throw new ValidationError('Datos requeridos no proporcionados')
        }

        const usuario = await Usuario.findOne({ where: { usuario: user } })
        if (!usuario) throw new NotFoundError('Usuario no encontrado')

        const isValidPassword = await bcrypt.compare(password, usuario.password)
        if (!isValidPassword) throw new ValidationError('Contraseña incorrecta')

        // creamos jwt
        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol, empresa: usuario.empresa, ranchos: usuario.ranchos, cultivo: usuario.variedad }, envs.SECRET_JWT_KEY, { expiresIn: '24h' })

        return { message: 'Usuario logueado correctamente', token, rol: usuario.rol }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        })
        if (error instanceof CustomError) throw error
        throw new DatabaseError('Error al iniciar sesión')
      }
    })
  }

  // funcion cambiar contraseña usuario
  static async changePassword ({ id, oldPassword, newPassword, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        const usuario = await Usuario.findByPk(id)
        if (!usuario) return { error: 'usuario no encontrado' }
        const isValidPassword = await bcrypt.compare(oldPassword, usuario.password)
        if (!isValidPassword) return { error: 'contraseña actual incorrecta' }
        usuario.password = newPassword
        await usuario.save({ transaction })
        return { message: 'contraseña cambiada correctamente' }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        })
        if (error instanceof CustomError) throw error
        throw new ValidationError('Error al actulizar la contraseña')
      }
    })
  }

  // funcion cambiar contraseña Admin
  static async changePasswordAdmin ({ id, newPassword }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id || !newPassword) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Usuario.findByPk(id)
      if (!usuario) throw new NotFoundError('usuario no encontrado')
      usuario.password = newPassword
      await usuario.save()
      return { message: 'Contraseña cambiada correctamente' }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al cambiar contraseña')
    }
  }
}

import { enviarCorreo } from '../config/smtp.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
import { RoleService } from '../services/role.service.js'

export class UsuarioController {
  constructor({ usuarioModel }) {
    this.usuarioModel = usuarioModel
  }

  // ... (delete, getAll, getUsuarios methods remain unchanged)

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const logger = req.logger
    const { user } = req.session
    const logContext = {
      operation: 'ELIMINAR USUARIO',
      nombre: user.nombre,
      rol: user.rol,
      id_eliminado: id
    }
    logger.info('Iniciando controlador', logContext)
    const result = await this.usuarioModel.delete({ id, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.json({ message: `${result.message}` })
  })

  // obtener  usuario
  getAll = asyncHandler(async (req, res) => {
    const usuario = await this.usuarioModel.getAll()
    return res.json(usuario)
  })

  // obtener todos los usuarios por empresa
  getUsuarios = asyncHandler(async (req, res) => {
    const { user } = req.session

    const usuario = await this.usuarioModel.getUsuarios({ nombre: user.nombre, rol: user.rol, empresa: user.empresa })
    return res.json(usuario)
  })

  create = asyncHandler(async (req, res) => {
    const result = await this.usuarioModel.create({ data: req.body })

    // Sincronizar rol en tabla relacional
    if (result.user && req.body.rol) {
      await RoleService.syncUserRole(result.user.id, req.body.rol)
    }

    await enviarCorreo({ email: req.body.email, subject: 'Bienvenido Nuevo Usuario', password: req.body.password })// si se creo con exito el usuario enviamos correo con la contraseña
    return res.json({ message: result.message })
  })

  update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await this.usuarioModel.update({ id, data: req.body })

    // Sincronizar rol en tabla relacional si se actualizó el rol
    if (req.body.rol) {
      await RoleService.syncUserRole(id, req.body.rol)
    }

    return res.json({ message: result.message })
  })

  login = asyncHandler(async (req, res) => {
    const { user, password } = req.body
    const logger = req.logger
    const logContext = {
      operation: 'LOGIN',
      user,
      password
    }
    try {
      logger.info('LOGIN started', logContext)
      const result = await this.usuarioModel.login({ user, password, logContext, logger })
      return res
        .cookie('access_token', result.token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor
          secure: false,
          sameSite: 'strict' // la cookie solo se puede acceder en el mismo dominio
          // maxAge: 60 * 60 * 24 * 30 // la cookie expira
        })
        .send({ message: result.message, rol: result.rol })
    } catch (error) {
      // Log detallado del error
      logger.error('Error al iniciar sesion', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  })

  // actualizar contraseña del usuario
  changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { contrasenaRes, contrasenaRepRes } = req.body
    const logger = req.logger
    const { user } = req.session
    const logContext = {
      operation: 'Cambio de contraseña',
      nombre: user.nombre,
      rol: user.rol,
      id_cambio: id
    }
    console.log('body', req.body)
    if (contrasenaRes !== contrasenaRepRes) {
      throw new ValidationError('Las contraseñas no coinciden', {
        statusCode: 400,
        logContext
      })
    }
    logger.info('Iniciando controlador', logContext)
    const result = await this.usuarioModel.changePasswordAdmin({ id, newPassword: contrasenaRes, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    return res.json({ message: result.message })
  })

  // obtener una empresa
  getOne = async (req, res) => {
    const { id } = req.params
    const usuario = await this.usuarioModel.getOne({ id })
    return res.json(usuario)
  }
}

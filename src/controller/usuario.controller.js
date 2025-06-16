import { enviarCorreo } from '../config/smtp.js'
import { asyncHandler } from '../utils/asyncHandler.js'
export class UsuarioController {
  constructor ({ usuarioModel }) {
    this.usuarioModel = usuarioModel
  }

  // borra usuario
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await this.usuarioModel.delete({ id })
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
    await enviarCorreo({ email: req.body.email, subject: 'Bienvenido Nuevo Usuario', password: req.body.password })// si se creo con exito el usuario enviamos correo con la contraseña
    return res.json({ message: result.message })
  })

  update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await this.usuarioModel.update({ id, data: req.body })
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
    const { newPassword } = req.body
    const logger = req.logger
    const logContext = {
      operation: 'CHANGE_PASSWORD',
      id,
      newPassword
    }
    try {
      logger.info('CHANGE_PASSWORD started', logContext)
      const result = await this.usuarioModel.changePasswordAdmin({ id, newPassword, logContext, logger })
      logger.info('CHANGE_PASSWORD completed', logContext)
      return res.json({ message: result.message })
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mezcla', {
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

  // obtener una empresa
  getOne = async (req, res) => {
    const { id } = req.params
    const usuario = await this.usuarioModel.getOne({ id })
    return res.json(usuario)
  }
}

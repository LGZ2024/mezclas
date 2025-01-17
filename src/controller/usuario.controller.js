import { enviarCorreo } from '../config/smtp.js'
export class UsuarioController {
  constructor ({ usuarioModel }) {
    this.usuarioModel = usuarioModel
  }

  // borra usuario
  delete = async (req, res) => {
    const { id } = req.params
    try {
      const result = await this.usuarioModel.delete({ id })
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      res.json({ message: `${result.message}` })
    } catch (error) {
      console.error({ error: `${error}` })
      res.status(500).json({ error: 'Error de Servidor' })
    }
  }

  // obtener  usuario
  getAll = async (req, res) => {
    try {
      // obetenmos todos las usuario
      const usuario = await this.usuarioModel.getAll()
      if (usuario.error) {
        res.status(404).json({ error: `${usuario.error}` })
      }
      res.json(usuario)
    } catch (error) {
      console.error({ error: `${error}` })
      res.status(500).json({ error: 'Error de Servidor' })
    }
  }

  // obtener una empresa
  getOne = async (req, res) => {
    const { id } = req.params
    try {
      const usuario = await this.usuarioModel.getOne({ id })
      if (usuario.error) {
        return res.status(404).json({ error: usuario.error }) // Asegúrate de usar return aquí
      } else {
        return res.json(usuario) // Asegúrate de usar return aquí también
      }
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).json({ error: 'Error de Servidor' }) // Asegúrate de usar return aquí
    }
  }

  // crear nuevo Usuario
  create = async (req, res) => {
    try {
      const result = await this.usuarioModel.create({ data: req.body })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      await enviarCorreo({ email: req.body.email, subject: 'Bienvenido Nuevo Usuario', password: req.body.password })// si se creo con exito el usuario enviamos correo con la contraseña
      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }

  // actualizar datos del usuario
  update = async (req, res) => {
    const { id } = req.params
    try {
      const result = await this.usuarioModel.update({ id, data: req.body })
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }

  // login usuario
  login = async (req, res) => {
    const { user, password } = req.body
    try {
      const result = await this.usuarioModel.login({ user, password })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res
        .cookie('access_token', result.token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor
          secure: false,
          sameSite: 'strict' // la cookie solo se puede acceder en el mismo dominio
          // maxAge: 60 * 60 * 24 * 30 // la cookie expira
        })
        .send({ message: result.message, rol: result.rol })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }

  // actualizar contraseña del usuario
  changePassword = async (req, res) => {
    const { id } = req.params
    const { newPassword } = req.body
    try {
      const result = await this.usuarioModel.changePasswordAdmin({ id, newPassword })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }
}

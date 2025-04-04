export class NotificacionesController {
  constructor ({ notificacionModel }) {
    this.notificacionModel = notificacionModel
  }

  // borra usuario
  delete = async (req, res) => {
    const { id } = req.params
    try {
      const result = await this.notificacionModel.delete({ id })
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
      const result = await this.notificacionModel.getAll()
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      res.json(result)
    } catch (error) {
      console.error({ error: `${error}` })
      res.status(500).json({ error: 'Error de Servidor' })
    }
  }

  // obtener  usuario
  getAllIdUsuario = async (req, res) => {
    // ontenerdatso de sesion
    const { user } = req.session
    console.log(user)
    try {
      // obetenmos todos las usuario
      const result = await this.notificacionModel.getAllIdUsuario({ idUsuario: user.id })
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      res.json(result)
    } catch (error) {
      console.error({ error: `${error}` })
      res.status(500).json({ error: 'Error de Servidor' })
    }
  }

  // obtener una empresa
  getOne = async (req, res) => {
    const { id } = req.params
    try {
      const result = await this.notificacionModel.getOne({ id })
      if (result.error) {
        return res.status(404).json({ error: result.error }) // Asegúrate de usar return aquí
      } else {
        return res.json(result) // Asegúrate de usar return aquí también
      }
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).json({ error: 'Error de Servidor' }) // Asegúrate de usar return aquí
    }
  }

  // crear nuevo Usuario
  create = async (req, res) => {
    try {
      const result = await this.notificacionModel.create({ data: req.body })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
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
      const result = await this.notificacionModel.update({ id, data: req.body })
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }

  updateStatus = async (req, res) => {
    const { id } = req.params

    try {
      const result = await this.notificacionModel.updateStatus({ id })

      if (result.error) {
        return res.status(404).json({
          error: result.error
        })
      }

      return res.json({
        status: 'success',
        message: result.message
      })
    } catch (error) {
      console.error('Error en updateStatus:', error)
      return res.status(500).json({
        error: 'Error al actualizar el estado de la notificación'
      })
    }
  }
}

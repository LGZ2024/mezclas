import { enviarCorreo } from '../config/smtp.js'

export class ProductosController {
  constructor ({ productossModel }) {
    this.productossModel = productossModel
  }

  obtenerProductosSolicitud = async (req, res) => {
    console.log('si llego')
    try {
      const result = await this.productossModel.obtenerProductosSolicitud({ idSolicitud: req.params.idSolicitud })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json(result)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  obtenerTablaMezclasId = async (req, res) => {
    try {
      const id = req.params.id
      const result = await this.productossModel.obtenerTablaMezclasId({ id })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json(result.data)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  create = async (req, res) => {
    try {
      // Acceder a los datos de FormData
      const result = await this.productossModel.create({ data: req.body })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  actulizarEstado = async (req, res) => {
    const { user } = req.session
    try {
      const result = await this.productossModel.actualizarEstado({
        data: req.body,
        idUsuarioMezcla: user.id
      })

      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }

      // creamos la notificacion
      // const notificacion = await NotificacionModel.create({ idSolicitud: req.body.id_solicitud, mensaje: req.body.mensaje })
      // console.log(notificacion)

      if (result.productos.length > 0) {
        await enviarCorreo({
          type: 'notificacion',
          email: result.data[0].email,
          nombre: result.data[0].nombre,
          solicitudId: req.body.id_solicitud,
          data: result.productos,
          usuario: user
        })
      }

      return res.json({ message: result.message })
    } catch (error) {
      console.error('Error en actualizarEstado:', error)
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
      })
    }
  }

  EliminarPorducto = async (req, res) => {
    const { id } = req.params
    try {
      const result = await this.productossModel.EliminarPorducto({ id })

      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }

      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }
}

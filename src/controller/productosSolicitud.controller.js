import { enviarCorreo } from '../config/smtp.js'
import { asyncHandler } from '../utils/asyncHandler.js'
export class ProductosController {
  constructor ({ productossModel }) {
    this.productossModel = productossModel
  }

  obtenerProductosSolicitud = asyncHandler(async (req, res) => {
    const result = await this.productossModel.obtenerProductosSolicitud({ idSolicitud: req.params.idSolicitud })
    return res.json(result)
  })

  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await this.productossModel.obtenerTablaMezclasId({ id })
    return res.json(result.data)
  })

  create = asyncHandler(async (req, res) => {
    const result = await this.productossModel.create({ data: req.body })
    return res.json({ message: result.message })
  })

  actulizarEstado = asyncHandler(async (req, res) => {
    const { user } = req.session
    const result = await this.productossModel.actualizarEstado({
      data: req.body,
      idUsuarioMezcla: user.id
    })

    await enviarCorreo({
      type: 'notificacion',
      email: result.data[0].email,
      nombre: result.data[0].nombre,
      solicitudId: req.body.id_solicitud,
      data: result.productos,
      usuario: user
    })

    return res.json({ message: result.message })
  })

  EliminarPorducto = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await this.productossModel.EliminarPorducto({ id })
    return res.json({ message: result.message })
  })
}

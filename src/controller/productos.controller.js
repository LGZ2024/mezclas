import { RecetasModel } from '../models/recetas.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'
export class ProductosController {
  constructor ({ productosModel }) {
    this.productosModel = productosModel
  }

  getAll = asyncHandler(async (req, res) => {
    const productos = await this.productosModel.getAll()
    const recetas = await RecetasModel.getAll()
    res.json({ productos, recetas })
  })

  create = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'CREAR PRODUCTO',
      nombre: user.nombre,
      rol: user.rol,
      data: { ...req.body }
    }
    logger.info('Iniciando controlador', logContext)
    const nuevoProducto = await this.productosModel.create({ datos: req.body, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.status(200).json(nuevoProducto)
  })

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const logger = req.logger
    const { user } = req.session
    const logContext = {
      operation: 'ELIMINAR PRODUCTO',
      nombre: user.nombre,
      rol: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const resultado = await this.productosModel.delete({ id, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.json(resultado)
  })

  update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'EDITAR PRODUCTO',
      nombre: user.nombre,
      rol: user.rol,
      data: { ...req.body }
    }
    logger.info('Iniciando controlador', logContext)
    const productoActualizado = await this.productosModel.update({ id, datos: req.body, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.status(200).json(productoActualizado)
  })
}

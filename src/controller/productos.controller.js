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

  EliminarProducto = asyncHandler(async (req, res) => {
    const { id } = req.params
    const resultado = await this.productosModel.EliminarProducto({ id })
    res.json(resultado)
  })
}

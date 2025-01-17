import { RecetasModel } from '../models/recetas.models.js'
export class ProductosController {
  constructor ({ productosModel }) {
    this.productosModel = productosModel
  }

  // extraer
  getAll = async (req, res) => {
    try {
      const productos = await this.productosModel.getAll()
      const recetas = await RecetasModel.getAll()

      if (productos.error || recetas.error) {
        res.status(404).json({ error: productos.error ? productos.error : recetas.error })
      }
      res.json({ productos, recetas })
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // eLiminar Producto
  EliminarPorducto = async (req, res) => {
    const { id } = req.params
    try {
      const variedad = await this.productosModel.EliminarPorducto({ id })
      if (variedad.error) {
        res.status(404).json({ error: `${variedad.error}` })
      }
      res.json(variedad)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }
}

import { asyncHandler } from '../utils/asyncHandler.js'
export class CentroController {
  constructor ({ centroModel }) {
    this.centroModel = centroModel
  }

  // extraer
  getCentrosPorRancho = asyncHandler(async (req, res) => {
    const { rancho } = req.params
    const { user } = req.session
    let centroCoste
    // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
    if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
      centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: 'Fresa' })
    } else {
      centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: user.cultivo })
    }
    res.json(centroCoste)
  })

  getVariedadPorCentroCoste = asyncHandler(async (req, res) => {
    const { id } = req.params
    const variedad = await this.centroModel.getVariedadPorCentroCoste({ id })
    res.json(variedad)
  })

  getAll = asyncHandler(async (req, res) => {
    const variedad = await this.centroModel.getAll()
    res.json(variedad)
  })

  // actualizar porcentajes de las variedades
  porcentajeVariedad = asyncHandler(async (req, res) => {
    const result = await this.centroModel.porcentajeVariedad({ id: req.body.centroCoste, data: req.body.porcentajes })
    return res.json({ message: result.message })
  })
}

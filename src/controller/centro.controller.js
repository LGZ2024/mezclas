import { asyncHandler } from '../utils/asyncHandler.js'
export class CentroController {
  constructor ({ centroModel }) {
    this.centroModel = centroModel
  }

  // extraer
  getCentrosPorRancho = asyncHandler(async (req, res) => {
    const { rancho } = req.params
    const { user } = req.session
    const logger = req.logger // Logger con correlación

    let centroCoste
    const logContext = {
      operation: 'GET_CENTROS_POR_RANCHO',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      rancho,
      cultivo: user.cultivo,
      timestamp: new Date().toISOString()
    }
    try {
      logger.info('Inicio de operación para obtener centros de coste por rancho', logContext)

      // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
      if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
        centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: 'Fresa' })
      } else {
        centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: user.cultivo })
      }
      logger.info('Operación finalizada para obtener centros de coste por rancho', logContext, centroCoste)
      res.json(centroCoste)
    } catch (error) {
      logger.error('Error en la operación para obtener centros de coste por rancho', {
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

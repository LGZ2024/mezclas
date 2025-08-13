import { asyncHandler } from '../utils/asyncHandler.js'
export class CentroController {
  constructor ({ centroModel }) {
    this.centroModel = centroModel
  }

  create = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion centro de coste',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const centroCoste = await this.centroModel.create({ data: req.body, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.json(centroCoste)
  })

  delete = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Eliminacion de centro de coste',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const centroCoste = await this.centroModel.delete({ id, logContext, logger })
    logger.info('Finalizando controlador', logContext)
    res.json(centroCoste)
  })

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
      cultivo: user.cultivo
    }

    logger.info('Inicio de operación para obtener centros de coste por rancho', logContext)

    // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
    if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
      centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: 'Fresa' })
    } else {
      centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: user.cultivo })
    }
    logger.info('Operación finalizada para obtener centros de coste por rancho', logContext, centroCoste)
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

  getAllOption = asyncHandler(async (req, res) => {
    const variedad = await this.centroModel.getAllOption()
    res.json(variedad)
  })

  // actualizar porcentajes de las variedades
  porcentajeVariedad = asyncHandler(async (req, res) => {
    const result = await this.centroModel.porcentajeVariedad({ id: req.body.centroCoste, data: req.body.porcentajes })
    return res.json({ message: result.message })
  })
}

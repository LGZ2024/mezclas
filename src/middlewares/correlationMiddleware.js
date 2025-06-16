import { loggerConfig } from '../config/logger.config.js'
import logger from '../utils/logger.js'

export const correlationMiddleware = (req, res, next) => {
  // Obtener o generar ID de correlación
  const correlationId = req.headers[loggerConfig.correlation.headerName] ||
                       logger.generateCorrelationId()

  // Agregar a request
  req.correlationId = correlationId

  // Agregar a headers de respuesta
  res.setHeader(loggerConfig.correlation.headerName, correlationId)

  // Crear logger con correlación
  req.logger = logger.withCorrelation(correlationId)

  next()
}

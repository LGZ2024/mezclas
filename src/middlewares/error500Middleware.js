import logger from '../utils/logger.js'
import { CustomError } from '../utils/CustomError.js'
import { envs } from '../config/env.mjs'

export const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', { codeError: '404', title: '404 - Página no encontrada', errorMsg: 'La página que buscas no fue encontrada.' })
}

export const errorHandler = (err, req, res, next) => {
  const errorContext = {
    url: req.originalUrl,
    method: req.method,
    userId: req.session?.user?.id,
    userRole: req.session?.user?.rol,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }

  logger.logError(err, errorContext)

  // Errores conocidos
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      details: envs.MODE === 'development' ? err.details : undefined,
      timestamp: err.timestamp
    })
  }

  // Error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Error de validación en la base de datos',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    })
  }

  // Error no controlado
  const statusCode = err.statusCode || 500
  return res.status(statusCode).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: envs.MODE === 'production'
      ? 'Error interno del servidor'
      : err.message,
    timestamp: new Date().toISOString()
  })
}

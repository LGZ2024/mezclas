import logger from '../utils/logger.js'
import { envs } from '../config/env.mjs'

export const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', { codeError: '404', title: '404 - Página no encontrada', errorMsg: 'La página que buscas no fue encontrada.' })
}

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Log del error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  })

  if (envs.MODE === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else {
    // Producción: no enviar detalles del error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Algo salió mal'
    })
  }
}

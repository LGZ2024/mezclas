import logger from '../config/logger.js'

const error500 = async (req, res, next) => {
  return res.status(500).render('errorPage', { codeError: '500', title: '500 - Error en el servidor', errorMsg: 'Error interno del servidor' })
}

const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', { codeError: '404', title: '404 - Página no encontrada', errorMsg: 'La página que buscas no fue encontrada.' })
}

const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    ip: req.ip
  })

  // Respuesta al cliente
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Error interno del servidor',
    code: err.code || 'INTERNAL_ERROR'
  })
}

export { error500, error404, errorHandler }

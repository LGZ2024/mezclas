import rateLimit from 'express-rate-limit'
import logger from '../utils/logger.js'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Límite de peticiones excedido', {
      ip: req.ip,
      path: req.path
    })
    res.status(429).json(options.message)
  },
  skip: (req) => {
    // Ignorar rutas específicas
    return req.path.startsWith('/public')
  }
})

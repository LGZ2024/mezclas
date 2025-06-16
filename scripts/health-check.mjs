import { Router } from 'express'
import logger from '../src/utils/logger.js'
import sequelize from '../db/db.js'

const router = Router()
logger.info('Iniciando health check', {
  timestamp: new Date().toISOString()
})

router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  })
})

router.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate()
    res.status(200).json({
      status: 'UP',
      checks: {
        database: 'UP',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    logger.error('Error en health check:', error)
    res.status(503).json({
      status: 'DOWN',
      checks: {
        database: 'DOWN',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    })
  }
})

export default router

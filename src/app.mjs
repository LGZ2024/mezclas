import { startServer } from './server/server.mjs'
import { envs } from './config/env.mjs'
import logger from './utils/logger.js'
import deployConfig from '../deploy.config.mjs'

const env = process.env.NODE_ENV || 'development'
const config = {
  ...deployConfig.common,
  ...deployConfig[env]
}

async function bootstrap () {
  try {
    logger.info('Iniciando aplicación', {
      environment: env,
      nodeVersion: process.version,
      port: envs.PORT
    })

    await startServer({
      PORT: envs.PORT,
      MODE: envs.MODE,
      config
    })

    logger.info('✅ Servidor iniciado correctamente', {
      port: envs.PORT,
      mode: envs.MODE
    })
  } catch (error) {
    logger.error('Error al iniciar el servidor', {
      error: {
        message: error.message,
        stack: error.stack
      }
    })
    process.exit(1)
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise
  })
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: {
      message: error.message,
      stack: error.stack
    }
  })
  process.exit(1)
})

bootstrap()

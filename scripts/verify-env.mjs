import logger from '../src/utils/logger.js'
import { fileURLToPath } from 'url'

logger.info('Iniciando verificación de variables de entorno...')

const REQUIRED_VARIABLES = {
  development: [
    'NODE_ENV',
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'SECRET_JWT_KEY'
  ],
  production: [
    'NODE_ENV',
    'PLESK_MODE',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'SECRET_JWT_KEY'
  ]
}

export async function checkEnvironment () {
  try {
    logger.info('Verificando variables de entorno...')

    const environment = process.env.NODE_ENV || 'development'
    const requiredVars = REQUIRED_VARIABLES[environment]

    const missingVars = []
    const warnings = []

    // Verificar variables requeridas
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        missingVars.push(varName)
      }
    }

    // Verificar valores específicos
    if (process.env.NODE_ENV && !['development', 'production'].includes(process.env.NODE_ENV)) {
      warnings.push(`NODE_ENV inválido: ${process.env.NODE_ENV}`)
    }

    if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
      warnings.push(`PORT debe ser un número: ${process.env.PORT}`)
    }

    // Verificar configuración de Plesk en producción
    if (environment === 'production') {
      if (process.env.PLESK_MODE !== 'true') {
        warnings.push('PLESK_MODE debería ser "true" en producción')
      }
    }

    // Log resultados
    if (missingVars.length > 0) {
      logger.error('❌ Faltan variables requeridas:', {
        missing: missingVars
      })
      throw new Error(`Variables requeridas no encontradas: ${missingVars.join(', ')}`)
    }

    if (warnings.length > 0) {
      logger.warn('⚠️ Advertencias en variables:', {
        warnings
      })
    }

    // Verificación de valores sensibles
    const sensitiveVars = ['DB_PASSWORD', 'EMAIL_PASSWORD', 'SECRET_JWT_KEY']
    const sensitiveResults = {}

    for (const varName of sensitiveVars) {
      if (process.env[varName]) {
        sensitiveResults[varName] = {
          set: true,
          length: process.env[varName].length
        }
      } else {
        sensitiveResults[varName] = {
          set: false
        }
      }
    }

    logger.info('✅ Variables de entorno verificadas correctamente', {
      environment,
      varsCount: requiredVars.length,
      warnings: warnings.length,
      sensitive: sensitiveResults
    })

    return true
  } catch (error) {
    logger.error('Error verificando variables:', error)
    throw error
  }
}

// Si se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkEnvironment()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

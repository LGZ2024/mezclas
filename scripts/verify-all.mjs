import { checkDatabase } from './verify-db.mjs'
import { checkEnvironment } from './verify-env.mjs'
import logger from '../src/utils/logger.js'

logger.info('Iniciando verificación completa...')

async function verifyAll () {
  try {
    logger.info('Iniciando verificación completa...')

    await checkEnvironment()
    await checkDatabase()

    logger.info('✅ Verificación completada exitosamente')
    process.exit(0)
  } catch (error) {
    logger.error('❌ Error en la verificación:', error)
    process.exit(1)
  }
}

verifyAll()

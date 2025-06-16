import { sequelize } from '../config/database.js'
import { enrichError, handleDatabaseError } from '../utils/errorHandlers.js'
import { CircuitBreaker, retryOperation } from '../utils/retryOperation.js'
import logger from '../utils/logger.js'

// Circuit breaker compartido para operaciones de base de datos
const dbCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000
})

// Opciones por defecto para retry
const defaultRetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  circuitBreaker: dbCircuitBreaker
}

/**
 * Ejecuta una operación dentro de una transacción con retry y circuit breaker
 * @param {Function} operation - Función que recibe la transacción como parámetro
 * @param {Object} context - Contexto de la operación para logs y errores
 * @param {Object} options - Opciones de retry y circuit breaker
 */
export const withTransaction = async (operation, context = {}, options = {}) => {
  const retryOpts = { ...defaultRetryOptions, ...options }
  const transaction = await sequelize.transaction()

  try {
    const result = await retryOperation(
      async () => operation(transaction),
      {
        ...context,
        transactionId: transaction.id
      },
      retryOpts
    )

    await transaction.commit()

    logger.info('Transacción completada exitosamente', {
      ...context,
      transactionId: transaction.id
    })

    return result
  } catch (error) {
    await transaction.rollback()

    logger.error('Error en transacción - rollback ejecutado', {
      ...context,
      transactionId: transaction.id,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      }
    })

    throw enrichError(error, {
      ...context,
      transactionId: transaction.id,
      rolledBack: true
    })
  }
}

/**
 * Ejecuta una consulta de base de datos con retry y circuit breaker
 * @param {Function} query - Función que ejecuta la consulta
 * @param {Object} context - Contexto de la operación
 * @param {Object} options - Opciones de retry y circuit breaker
 */
export const withDatabaseQuery = async (query, context = {}, options = {}) => {
  const retryOpts = { ...defaultRetryOptions, ...options }

  try {
    return await retryOperation(query, context, retryOpts)
  } catch (error) {
    throw handleDatabaseError(error, context.operation || 'QUERY', context)
  }
}

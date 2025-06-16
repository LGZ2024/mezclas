import { DatabaseError, TimeoutError, ServiceUnavailableError } from './CustomError.js'
import logger from './logger.js'

const TRANSIENT_ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'DEADLOCK',
  'LOCK_TIMEOUT',
  'PROTOCOL_CONNECTION_LOST',
  'ER_CON_COUNT_ERROR',
  'ECONNABORTED',
  'ER_LOCK_DEADLOCK'
]

const isTransientError = (error) => {
  if (!error) return false

  // Verificar códigos de error conocidos
  if (TRANSIENT_ERROR_CODES.includes(error.code)) return true

  // Verificar tipos de error específicos
  if (
    error instanceof TimeoutError ||
    error instanceof ServiceUnavailableError
  ) return true

  // Verificar mensajes de error
  const errorMsg = error.message?.toLowerCase() || ''
  return errorMsg.includes('deadlock') ||
         errorMsg.includes('timeout') ||
         errorMsg.includes('connection') ||
         errorMsg.includes('network') ||
         errorMsg.includes('unavailable')
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Circuit breaker para prevenir sobrecarga
export class CircuitBreaker {
  constructor (options = {}) {
    this.failureThreshold = options.failureThreshold || 5
    this.resetTimeout = options.resetTimeout || 60000
    this.failures = 0
    this.lastFailureTime = null
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
  }

  async execute (operation, context = {}) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN'
        logger.info('Circuit breaker entrando en estado HALF_OPEN', context)
      } else {
        throw new ServiceUnavailableError('Circuit breaker abierto - Servicio temporalmente no disponible')
      }
    }

    try {
      const result = await operation()
      if (this.state === 'HALF_OPEN') {
        this.reset()
        logger.info('Circuit breaker restaurado a estado CLOSED', context)
      }
      return result
    } catch (error) {
      this.recordFailure(error, context)
      throw error
    }
  }

  recordFailure (error, context) {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'
      logger.warn('Circuit breaker abierto por exceso de fallos', {
        ...context,
        failures: this.failures,
        error: error.message
      })
    }
  }

  reset () {
    this.failures = 0
    this.lastFailureTime = null
    this.state = 'CLOSED'
  }
}

// Función principal de retry con circuit breaker
export const retryOperation = async (operation, context = {}, options = {}) => {
  const {
    maxRetries = 3,
    circuitBreaker = null,
    baseDelay = 1000,
    errorFilter = isTransientError
  } = options

  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Si hay un circuit breaker, usarlo
      if (circuitBreaker) {
        return await circuitBreaker.execute(operation, context)
      } else {
        return await operation()
      }
    } catch (error) {
      lastError = error

      if (!errorFilter(error)) {
        logger.error('Error no transitorio detectado', {
          ...context,
          error: error.message,
          attempt,
          maxRetries
        })
        throw error
      }

      if (attempt === maxRetries) {
        logger.error('Operación fallida después del máximo de reintentos', {
          ...context,
          error: error.message,
          maxRetries
        })
        throw new DatabaseError('Operación fallida después de múltiples reintentos', {
          originalError: error.message,
          attempts: maxRetries,
          context
        })
      }

      const waitTime = baseDelay * Math.pow(2, attempt - 1) // Backoff exponencial

      logger.warn('Reintentando operación después de error transitorio', {
        ...context,
        error: error.message,
        attempt,
        maxRetries,
        nextRetryMs: waitTime
      })

      await delay(waitTime)
    }
  }

  throw lastError
}

// Helper para crear una versión con retry de cualquier función
export const withRetry = (operation, options = {}) => {
  return (...args) => retryOperation(() => operation(...args), options)
}

export default retryOperation

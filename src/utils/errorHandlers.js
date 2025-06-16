import logger from './logger.js'
import { CustomError, MezclaOperationError, DatabaseError } from './CustomError.js'

// Utilidad para enriquecer el contexto del error
export const enrichError = (error, context = {}) => {
  if (error instanceof CustomError) {
    error.details = {
      ...error.details,
      ...context,
      timestamp: new Date().toISOString()
    }
  }
  return error
}

// Manejo genérico de errores de base de datos
export const handleDatabaseError = (error, operation, context = {}) => {
  logger.logError(error, {
    operation,
    ...context,
    stack: error.stack
  })

  if (error instanceof CustomError) {
    throw enrichError(error, context)
  }

  throw new DatabaseError(`Error en operación: ${operation}`, {
    originalError: error.message,
    context: {
      ...context,
      operation
    }
  })
}

// Manejo genérico de errores de operaciones
export const handleOperationError = (error, operation, context = {}) => {
  logger.logError(error, {
    operation,
    ...context,
    stack: error.stack
  })

  if (error instanceof CustomError) {
    throw enrichError(error, context)
  }

  throw new MezclaOperationError(operation, `Error en operación: ${operation}`, {
    originalError: error.message,
    context: {
      ...context,
      operation
    }
  })
}

// Manejador de errores para transacciones
export const handleTransactionError = async (transaction, error, operation, context = {}) => {
  try {
    await transaction.rollback()
    logger.logDBTransaction(operation, 'rolled_back', {
      error: error.message,
      correlationId: context.correlationId
    })
  } catch (rollbackError) {
    logger.logError(rollbackError, {
      operation: `${operation}_ROLLBACK`,
      originalError: error.message,
      ...context
    })
  }

  handleOperationError(error, operation, context)
}

// Validador genérico de datos requeridos
export const validateRequiredData = (data = {}, requiredFields = [], context = {}) => {
  const missing = requiredFields.filter(field => {
    const value = data[field]
    return value === undefined || value === null || value === ''
  })

  if (missing.length > 0) {
    throw enrichError(
      new MezclaOperationError('VALIDATION', 'Datos requeridos no proporcionados', {
        required: requiredFields,
        missing,
        received: Object.keys(data),
        context
      })
    )
  }
}

// Manejo de excepciones async
export const withErrorHandling = (operation, handler) => {
  return async (...args) => {
    try {
      return await handler(...args)
    } catch (error) {
      handleOperationError(error, operation, { args })
    }
  }
}

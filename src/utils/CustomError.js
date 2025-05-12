export class CustomError extends Error {
  constructor (message, statusCode, errorCode, details = {}) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details
    this.timestamp = new Date().toISOString()
    this.status = this.getStatusType(statusCode)
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }

  getStatusType (statusCode) {
    if (statusCode >= 500) return 'error'
    if (statusCode >= 400) return 'fail'
    return 'success'
  }
}

export class ValidationError extends CustomError {
  constructor (message = 'Error de validación', details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

export class NotFoundError extends CustomError {
  constructor (message = 'Recurso no encontrado', details = {}) {
    super(message, 404, 'NOT_FOUND', details)
  }
}

export class DatabaseError extends CustomError {
  constructor (message = 'Error en la base de datos', details = {}) {
    super(message, 500, 'DB_ERROR', details)
  }
}

export class BusinessError extends CustomError {
  constructor (message = 'Error de negocio', details = {}) {
    super(message, 422, 'BUSINESS_ERROR', details)
  }
}

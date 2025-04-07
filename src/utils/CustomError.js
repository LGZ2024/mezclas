export class CustomError extends Error {
  constructor (message, statusCode, errorCode) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Errores específicos
export class NotFoundError extends CustomError {
  constructor (message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends CustomError {
  constructor (message = 'Error de validación') {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class DatabaseError extends CustomError {
  constructor (message = 'Error en la base de datos') {
    super(message, 500, 'DB_ERROR')
  }
}

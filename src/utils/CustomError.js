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
export class UnauthorizedError extends CustomError {
  constructor (message = 'No autorizado', details = {}) {
    super(message, 401, 'UNAUTHORIZED', details)
  }
}
export class ForbiddenError extends CustomError {
  constructor (message = 'Acceso denegado', details = {}) {
    super(message, 403, 'FORBIDDEN', details)
  }
}
export class ConflictError extends CustomError {
  constructor (message = 'Conflicto', details = {}) {
    super(message, 409, 'CONFLICT', details)
  }
}
export class InternalServerError extends CustomError {
  constructor (message = 'Error interno del servidor', details = {}) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details)
  }
}
export class ServiceUnavailableError extends CustomError {
  constructor (message = 'Servicio no disponible', details = {}) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details)
  }
}
export class RateLimitError extends CustomError {
  constructor (message = 'Límite de solicitudes alcanzado', details = {}) {
    super(message, 429, 'RATE_LIMIT', details)
  }
}
export class TimeoutError extends CustomError {
  constructor (message = 'Tiempo de espera agotado', details = {}) {
    super(message, 504, 'TIMEOUT', details)
  }
}
export class NotImplementedError extends CustomError {
  constructor (message = 'Funcionalidad no implementada', details = {}) {
    super(message, 501, 'NOT_IMPLEMENTED', details)
  }
}
export class BadRequestError extends CustomError {
  constructor (message = 'Solicitud incorrecta', details = {}) {
    super(message, 400, 'BAD_REQUEST', details)
  }
}
export class MezclaOperationError extends CustomError {
  constructor (operation, message, details = {}) {
    super(message, 500, `MEZCLA_${operation}_ERROR`, {
      operation,
      ...details
    })
  }
}

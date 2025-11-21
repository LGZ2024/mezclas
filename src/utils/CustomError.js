/**
 * Clase base para errores personalizados
 * Extiende Error y proporciona estructura estándar para todos los errores de la aplicación
 */
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

  /**
   * Determina el tipo de estado basado en el código HTTP
   * @param {number} statusCode - Código de estado HTTP
   * @returns {string} 'error' (5xx), 'fail' (4xx), o 'success'
   */
  getStatusType (statusCode) {
    if (statusCode >= 500) return 'error'
    if (statusCode >= 400) return 'fail'
    return 'success'
  }
}

/**
 * Error de validación de datos (400)
 * Usado cuando los datos enviados no cumplen las reglas de validación
 * @example new ValidationError('El email no es válido', { field: 'email' })
 */
export class ValidationError extends CustomError {
  constructor (message = 'Error de validación', details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

/**
 * Error de solicitud incorrecta (400)
 * Usado cuando la solicitud está malformada o es inválida
 * @example new BadRequestError('Parámetros faltantes')
 */
export class BadRequestError extends CustomError {
  constructor (message = 'Solicitud incorrecta', details = {}) {
    super(message, 400, 'BAD_REQUEST', details)
  }
}

/**
 * Error de autenticación (401)
 * Usado cuando el usuario no está autenticado
 * @example new UnauthorizedError('Token expirado')
 */
export class UnauthorizedError extends CustomError {
  constructor (message = 'No autorizado', details = {}) {
    super(message, 401, 'UNAUTHORIZED', details)
  }
}

/**
 * Error de autorización (403)
 * Usado cuando el usuario no tiene permisos para acceder al recurso
 * @example new ForbiddenError('No tienes permiso para eliminar activos')
 */
export class ForbiddenError extends CustomError {
  constructor (message = 'Acceso denegado', details = {}) {
    super(message, 403, 'FORBIDDEN', details)
  }
}

/**
 * Error de recurso no encontrado (404)
 * Usado cuando se intenta acceder a un recurso que no existe
 * @example new NotFoundError('Activo no encontrado', { id: 123 })
 */
export class NotFoundError extends CustomError {
  constructor (message = 'Recurso no encontrado', details = {}) {
    super(message, 404, 'NOT_FOUND', details)
  }
}

/**
 * Error de conflicto (409)
 * Usado cuando hay un conflicto con el estado actual (ej: duplicado)
 * @example new ConflictError('El código ya existe en la base de datos')
 */
export class ConflictError extends CustomError {
  constructor (message = 'Conflicto', details = {}) {
    super(message, 409, 'CONFLICT', details)
  }
}

/**
 * Error de límite de solicitudes (429)
 * Usado cuando se excede el límite de solicitudes (rate limiting)
 * @example new RateLimitError('Demasiadas solicitudes, intenta más tarde')
 */
export class RateLimitError extends CustomError {
  constructor (message = 'Límite de solicitudes alcanzado', details = {}) {
    super(message, 429, 'RATE_LIMIT', details)
  }
}

/**
 * Error de negocio (422)
 * Usado cuando la lógica de negocio rechaza la operación
 * @example new BusinessError('No se puede eliminar un activo en uso')
 */
export class BusinessError extends CustomError {
  constructor (message = 'Error de negocio', details = {}) {
    super(message, 422, 'BUSINESS_ERROR', details)
  }
}

/**
 * Error de base de datos (500)
 * Usado cuando hay un error en la operación de base de datos
 * @example new DatabaseError('Error al insertar registro', { table: 'activos' })
 */
export class DatabaseError extends CustomError {
  constructor (message = 'Error en la base de datos', details = {}) {
    super(message, 500, 'DB_ERROR', details)
  }
}

/**
 * Error interno del servidor (500)
 * Usado para errores genéricos del servidor
 * @example new InternalServerError('Algo salió mal')
 */
export class InternalServerError extends CustomError {
  constructor (message = 'Error interno del servidor', details = {}) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details)
  }
}

/**
 * Error de funcionalidad no implementada (501)
 * Usado cuando se intenta usar una funcionalidad aún no disponible
 * @example new NotImplementedError('El reporte de depreciación aún no está disponible')
 */
export class NotImplementedError extends CustomError {
  constructor (message = 'Funcionalidad no implementada', details = {}) {
    super(message, 501, 'NOT_IMPLEMENTED', details)
  }
}

/**
 * Error de servicio no disponible (503)
 * Usado cuando un servicio externo no está disponible
 * @example new ServiceUnavailableError('Base de datos no disponible')
 */
export class ServiceUnavailableError extends CustomError {
  constructor (message = 'Servicio no disponible', details = {}) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details)
  }
}

/**
 * Error de timeout (504)
 * Usado cuando se agota el tiempo de espera de una operación
 * @example new TimeoutError('La solicitud tardó demasiado')
 */
export class TimeoutError extends CustomError {
  constructor (message = 'Tiempo de espera agotado', details = {}) {
    super(message, 504, 'TIMEOUT', details)
  }
}

/**
 * Error específico de operaciones con mezclas (500)
 * Usado para errores relacionados con la creación, actualización o eliminación de mezclas
 * @example new MezclaOperationError('CREATE', 'No hay suficientes productos disponibles')
 */
export class MezclaOperationError extends CustomError {
  constructor (operation, message, details = {}) {
    super(message, 500, `MEZCLA_${operation}_ERROR`, {
      operation,
      ...details
    })
  }
}

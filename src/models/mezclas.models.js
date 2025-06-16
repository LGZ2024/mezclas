// Modelos de Base de Datos
import { Solicitud } from '../schema/mezclas.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Usuario } from '../schema/usuarios.js'
import { Centrocoste } from '../schema/centro.js'

// Configuraciones
import { guardarImagen } from '../config/foto.mjs'
import { enviarCorreo } from '../config/smtp.js'

// Modelos de Negocio
import { CentroCosteModel } from '../models/centro.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import { UsuarioModel } from '../models/usuario.models.js'

// Utilidades
import { format } from 'date-fns'
import { DbHelper } from '../utils/dbHelper.js'
import logger from '../utils/logger.js'
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  CustomError,
  MezclaOperationError

} from '../utils/CustomError.js'

import { Op } from 'sequelize'

export class MezclaModel {
  // Métodos auxiliares de validación
  static #validarDatos (datos = {}, camposRequeridos = []) {
    const errores = []
    const recibidos = {}

    camposRequeridos.forEach(campo => {
      if (!datos[campo]) {
        errores.push(`El campo ${campo} es requerido`)
      }
      recibidos[campo] = !!datos[campo]
    })

    if (errores.length > 0) {
      throw new ValidationError('Datos requeridos no proporcionados', {
        errores,
        recibidos
      })
    }
  }

  static async #ejecutarTransaccion (operacion, callback, logContext, transaction) {
    try {
      logger.logDBTransaction(operacion, 'started', {
        correlationId: logContext.correlationId
      })

      const resultado = await callback(transaction)

      logger.logDBTransaction(operacion, 'committed', {
        correlationId: logContext.correlationId
      })

      return resultado
    } catch (error) {
      logger.logDBTransaction(operacion, 'rolled_back', {
        error: error.message,
        correlationId: logContext.correlationId
      })
      throw error
    }
  }

  // funciones privadas
  static async create ({ data, idUsuario, rol, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logModelOperation('CREATE_MEZCLA_modelo', 'started', logContext)

        this.#validarDatos(data, ['empresaPertece', 'rancho', 'centroCoste', 'productos'])

        const resultado = await this.#ejecutarTransaccion('CREATE_MEZCLA', async () => {
          const { variedad, porcentajes } = await this.#procesarVariedades({
            data,
            transaction
          })

          const solicitud = await this.#crearSolicitudBase({
            data,
            variedad,
            porcentajes,
            idUsuario,
            rol,
            transaction
          })

          if (data.productos?.length) {
            await this.#procesarProductos({
              productos: data.productos,
              idSolicitud: solicitud.id,
              transaction
            })
          }

          return {
            message: 'Solicitud de mezcla registrada correctamente',
            idSolicitud: solicitud.id,
            fechaSolicitud: solicitud.fechaSolicitud,
            data: solicitud
          }
        }, logContext)

        logger.logOperation('CREATE_MEZCLA_modelo', 'completed', {
          ...logContext,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return resultado
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new MezclaOperationError('CREATE', 'Error al registrar solicitud de mezcla', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async cerrarSolicitud ({ data, idUsuario, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('CERRAR_SOLICITUD_modelo', 'started', logContext)

        this.#validarDatos(data, ['idSolicitud', 'imagen'])

        const resultado = await this.#ejecutarTransaccion('CERRAR_SOLICITUD', async (transaction) => {
          const solicitud = await this.#buscarSolicitud({
            id: data.idSolicitud,
            transaction
          })

          const { solicitudActualizada } = await this.#actualizarSolicitud({
            solicitud,
            data: {
              imagenPath: logContext.requestBody.imagen,
              fecha: new Date()
            },
            idUsuario,
            transaction,
            logContext
          })

          await this.#notificarCierreSolicitud({
            solicitud: solicitudActualizada,
            idUsuario
          })

          return {
            message: 'Solicitud cerrada correctamente',
            status: solicitudActualizada.status,
            idUsuarioSolicita: solicitudActualizada.idUsuarioSolicita,
            id: solicitudActualizada.id
          }
        }, logContext, transaction)

        logger.logOperation('CERRAR_SOLICITUD', 'completed', {
          ...logContext,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return resultado
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new MezclaOperationError('CLOSE', 'Error al cerrar solicitud', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async validacion ({ data, idUsuario, user, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('VALIDAR_MEZCLA', 'started', logContext)

        this.#validarDatos({ data, idUsuario }, ['data', 'idUsuario'])

        const resultado = await this.#ejecutarTransaccion('VALIDAR_MEZCLA', async (transaction) => {
          const resultados = await Promise.all(data.map(async (estado) => {
            logger.logModelOperation('Solicitud', 'processing', {
              solicitudId: estado.id_solicitud,
              userId: idUsuario
            })

            const resultado = await procesarSolicitud({
              estado,
              idUsuario,
              user,
              transaction
            })

            logger.logModelOperation('Solicitud', 'processed', {
              solicitudId: estado.id_solicitud,
              status: resultado.status
            })

            return resultado
          }))

          return {
            message: 'Solicitudes guardadas correctamente',
            resultados
          }
        }, logContext, transaction)

        logger.logOperation('VALIDAR_MEZCLA', 'completed', {
          ...logContext,
          resultCount: resultado.resultados.length,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return resultado
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new MezclaOperationError('VALIDATE', 'Error al validar solicitudes', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async cancelar ({ idSolicitud, data, idUsuario, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('CANCELAR_MEZCLA_MODELO started', logContext)

        if (!idSolicitud || !data || !idUsuario) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['idSolicitud', 'data', 'idUsuario'],
            received: { idSolicitud, data: !!data, idUsuario }
          })
        }

        try {
          logger.logDBTransaction('CANCELAR_MEZCLA_MODELO transation iniciada', {
            solicitudId: idSolicitud,
            correlationId: logContext.correlationId
          })

          const solicitud = await Solicitud.findByPk(idSolicitud)
          if (!solicitud) {
            throw new NotFoundError(`Solicitud ${idSolicitud} no encontrada`)
          }

          logger.logModelOperation('CANCELAR_MEZCLA_MODELO obtener solicitud found', {
            solicitudId: solicitud.id,
            estadoActual: solicitud.status
          })

          // Actualizar solicitud
          solicitud.confirmacion = data.validacion === false ? 'Cancelada' : solicitud.confirmacion
          solicitud.idUsuarioValida = idUsuario
          solicitud.motivoCancelacion = data.motivo

          await solicitud.save({ transaction })

          logger.logModelOperation('CANCELAR_MEZCLA_MODELO actualizar solicitud updated', {
            solicitudId: solicitud.id,
            nuevoEstado: solicitud.confirmacion
          })

          // Notificación por correo
          const solicitante = await UsuarioModel.getOneId({
            id: solicitud.idUsuarioSolicita
          })

          logger.info('Notificando al solicitante', {
            solicitanteId: solicitante.id,
            solicitanteEmail: solicitante.email,
            solicitanteNombre: solicitante.nombre
          })

          if (solicitante?.email) {
            const respuesta = await enviarCorreo({
              type: 'cancelacion',
              email: solicitante.email,
              nombre: solicitante.nombre,
              solicitudId: solicitud.id,
              usuario: {
                empresa: solicitud.empresa,
                ranchos: solicitud.ranchoDestino
              },
              data: {
                motivo: data.motivo
              }
            })

            logger.logModelOperation('Notificacion enviada ', {
              solicitudId: solicitud.id,
              destinatario: solicitante.email,
              status: respuesta.error ? 'error' : 'success'
            })
          }

          logger.logOperation('CANCELAR_MEZCLA completed', {
            ...logContext,
            duration: Date.now() - new Date(logContext.timestamp).getTime()
          })

          return {
            message: 'Solicitud cancelada correctamente',
            solicitudId: solicitud.id
          }
        } catch (error) {
          logger.logDBTransaction('CANCELAR_MEZCLA', 'rolled_back', {
            error: error.message,
            correlationId: logContext.correlationId
          })
          throw error
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al cancelar solicitud', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async mezclaConfirmar ({ idSolicitud, data, usuario, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('CONFIRMAR_MEZCLA_modelo', 'started', logContext)

        if (!idSolicitud || !data) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['idSolicitud', 'data'],
            received: { idSolicitud, data: !!data }
          })
        }
        try {
          logger.logDBTransaction('CONFIRMAR_MEZCLA_modelo', 'started', {
            solicitudId: idSolicitud,
            correlationId: logContext.correlationId
          })

          const solicitud = await Solicitud.findByPk(idSolicitud)
          if (!solicitud) {
            throw new NotFoundError(`Solicitud ${idSolicitud} no encontrada`)
          }

          logger.logModelOperation('Solicitud', 'found', {
            solicitudId: solicitud.id,
            estadoActual: solicitud.status
          })

          // Actualizar campos
          const cambios = {
            confirmacion: 'Pendiente',
            ...(data.comentarios && { comentarios: data.comentarios }),
            ...(data.fechaSolicitud && { fechaSolicitud: data.fechaSolicitud }),
            ...(data.empresa && { empresa: data.empresa }),
            ...(data.ranchoDestino && { ranchoDestino: data.ranchoDestino }),
            ...(data.descripcion && { descripcion: data.descripcion }),
            ...(data.folio && { folio: data.folio }),
            ...(data.temporada && { temporada: data.temporada }),
            ...(data.cantidad && { cantidad: data.cantidad }),
            ...(data.presentacion && { presentacion: data.presentacion }),
            ...(data.metodoAplicacion && { metodoAplicacion: data.metodoAplicacion })
          }

          Object.assign(solicitud, cambios)
          await solicitud.save({ transaction })

          logger.logModelOperation('Solicitud', 'updated', {
            solicitudId: solicitud.id,
            cambios
          })

          // Notificar al mezclador
          const mezclador = await UsuarioModel.getOneId({
            id: solicitud.idUsuarioValida
          })

          if (mezclador?.email) {
            const respuesta = await enviarCorreo({
              type: 'reevaluacion',
              email: mezclador.email,
              nombre: usuario.nombre,
              solicitudId: solicitud.id,
              usuario: {
                empresa: usuario.empresa,
                ranchos: mezclador.ranchoDestino
              },
              data: {
                folio: solicitud.folio || 'No Aplica',
                cantidad: solicitud.cantidad || 'No Aplica',
                presentacion: solicitud.presentacion || 'No Aplica',
                metodoAplicacion: solicitud.metodoAplicacion,
                motivo: solicitud.motivoCancelacion,
                comentarios: solicitud.comentario || 'Por favor, revisar las proporciones'
              }
            })

            logger.logModelOperation('Notificacion', 'sent', {
              solicitudId: solicitud.id,
              destinatario: mezclador.email,
              status: respuesta.error ? 'error' : 'success'
            })
          }

          logger.logOperation('CONFIRMAR_MEZCLA_modelo', 'completed', {
            ...logContext,
            duration: Date.now() - new Date(logContext.timestamp).getTime()
          })

          return {
            message: 'Solicitud actualizada correctamente',
            solicitudId: solicitud.id
          }
        } catch (error) {
          logger.logDBTransaction('CONFIRMAR_MEZCLA_modelo', 'rolled_back', {
            error: error.message,
            correlationId: logContext.correlationId
          })
          throw error
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al confirmar mezcla', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async estadoProceso ({ id, data, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('modelo_estado_proceso', 'iniciado', logContext)
        // Validación de datos
        if (!id || !data) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['id', 'data'],
            received: { id, data: !!data }
          })
        }
        try {
          logger.logDBTransaction('ACTUALIZAR_ESTADO', 'started', {
            solicitudId: id,
            correlationId: logContext.correlationId
          })

          // Buscar solicitud
          const solicitud = await Solicitud.findByPk(id)
          if (!solicitud) {
            throw new NotFoundError(`Solicitud con ID ${id} no encontrada`, {
              solicitudId: id
            })
          }

          logger.logModelOperation('Solicitud', 'found', {
            solicitudId: solicitud.id,
            estadoActual: solicitud.status
          })

          // Actualizar campos
          const cambios = {
            ...(data.notaMezcla && { notaMezcla: data.notaMezcla }),
            ...(data.status && { status: data.status })
          }

          Object.assign(solicitud, cambios)
          await solicitud.save({ transaction })

          logger.logModelOperation('Solicitud', 'updated', {
            solicitudId: solicitud.id,
            cambios
          })

          logger.logOperation('ACTUALIZAR_ESTADO', 'completed', {
            ...logContext,
            duration: Date.now() - new Date(logContext.timestamp).getTime()
          })

          return {
            message: 'Solicitud actualizada correctamente',
            idUsuarioSolicita: solicitud.idUsuarioSolicita
          }
        } catch (error) {
          logger.logDBTransaction('ACTUALIZAR_ESTADO', 'rolled_back', {
            error: error.message,
            correlationId: logContext.correlationId
          })
          throw error
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al actualizar estado de solicitud', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async mensajeSolicita ({ id, mensajes, idUsuario, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('MENSAJE_SOLICITUD', 'started', logContext)

        // Validación de datos
        if (!id || !mensajes || !idUsuario) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['id', 'mensajes', 'idUsuario'],
            received: { id, mensajes: !!mensajes, idUsuario }
          })
        }

        try {
          logger.logDBTransaction('MENSAJE_SOLICITUD', 'started', {
            solicitudId: id,
            correlationId: logContext.correlationId
          })

          // Buscar solicitud
          const solicitud = await Solicitud.findByPk(id)
          if (!solicitud) {
            throw new NotFoundError(`Solicitud con ID ${id} no encontrada`, {
              solicitudId: id
            })
          }

          logger.logModelOperation('Solicitud', 'found', {
            solicitudId: solicitud.id,
            mensajeAnterior: solicitud.respuestaSolicitud
          })

          // Actualizar mensaje
          solicitud.respuestaSolicitud = mensajes
          await solicitud.save({ transaction })

          logger.logModelOperation('Solicitud', 'updated', {
            solicitudId: solicitud.id,
            nuevoMensaje: mensajes
          })

          // Crear notificación
          await NotificacionModel.create({
            idSolicitud: id,
            mensaje: `Respuesta para solicitud:${id}`,
            idUsuario
          }, { transaction })

          logger.logModelOperation('Notificacion', 'created', {
            solicitudId: id,
            userId: idUsuario
          })

          logger.logOperation('MENSAJE_SOLICITUD', 'completed', {
            ...logContext,
            duration: Date.now() - new Date(logContext.timestamp).getTime()
          })

          return {
            message: 'Notificación guardada correctamente',
            solicitudId: id
          }
        } catch (error) {
          await transaction.rollback()
          logger.logDBTransaction('MENSAJE_SOLICITUD', 'rolled_back', {
            error: error.message,
            correlationId: logContext.correlationId
          })
          throw error
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al guardar mensaje de solicitud', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  // metodos de consultas especificos
  //
  static async getAll () {
    const logContext = {
      operation: 'GET_ALL_MEZCLAS',
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_ALL_MEZCLAS', 'started', logContext)

      const mezclas = await Solicitud.findAll({
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          },
          {
            model: Centrocoste,
            attributes: ['centroCoste']
          }
        ],
        attributes: [
          'id', 'ranchoDestino', 'variedad', 'notaMezcla',
          'folio', 'temporada', 'cantidad', 'presentacion',
          'metodoAplicacion', 'descripcion', 'status',
          'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        count: mezclas.length
      })

      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        logger.debug('Procesando mezcla', {
          id: m.id,
          usuario: m.usuario?.nombre,
          centroCoste: m.centrocoste?.centroCoste
        })

        return {
          id: m.id,
          Solicita: m.usuario?.nombre || 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      logger.logOperation('GET_ALL_MEZCLAS', 'completed', {
        ...logContext,
        count: resultadosFormateados.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener todas las mezclas', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async obtenerMezclasMichoacan () {
    const logContext = {
      operation: 'GET_MEZCLAS_MICHOACAN',
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_MEZCLAS_MICHOACAN', 'started', logContext)

      const mezclas = await Solicitud.findAll({
        where: {
          empresa: {
            [Op.or]: ['Moras Finas', 'Bayas del Centro']
          }
        },
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          }
        ],
        attributes: [
          'id', 'ranchoDestino', 'variedad', 'notaMezcla',
          'folio', 'temporada', 'cantidad', 'presentacion',
          'metodoAplicacion', 'descripcion', 'status',
          'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        count: mezclas.length,
        empresas: ['Moras Finas', 'Bayas del Centro']
      })

      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        logger.debug('Procesando mezcla', {
          id: m.id,
          usuario: m.usuario?.nombre
        })

        return {
          id: m.id,
          Solicita: m.usuario?.nombre || 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      logger.logOperation('GET_MEZCLAS_MICHOACAN', 'completed', {
        ...logContext,
        count: resultadosFormateados.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return {
        message: 'Mezclas obtenidas correctamente',
        data: Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      }
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener mezclas de Michoacán', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async obtenerTablaMezclasEmpresa ({ status, empresa, confirmacion, idUsuario, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      return this.#ejecutarConsulta('GET_MEZCLAS_EMPRESA', async () => {
        this.#validarDatos({ status, empresa }, ['status', 'empresa'])
        const mezclas = await Solicitud.findAll({
          where: {
            empresa,
            status,
            confirmacion
          },
          include: [
            {
              model: Usuario,
              attributes: ['nombre']
            },
            {
              model: Centrocoste,
              attributes: ['centroCoste']
            }
          ],
          attributes: [
            'id', 'ranchoDestino', 'variedad', 'notaMezcla',
            'folio', 'temporada', 'cantidad', 'presentacion',
            'metodoAplicacion', 'descripcion', 'status',
            'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega',
            'respuestaSolicitud'
          ]
        })

        logger.logModelOperation('Solicitud', 'found', {
          count: mezclas.length,
          empresa,
          status
        })

        const resultadosFormateados = mezclas.map(mezcla => {
          const m = mezcla.toJSON()
          return {
            id: m.id,
            Solicita: m.usuario?.nombre || 'Usuario no encontrado',
            fechaSolicitud: m.fechaSolicitud,
            ranchoDestino: m.ranchoDestino,
            notaMezcla: m.notaMezcla,
            empresa: m.empresa,
            centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
            variedad: m.variedad,
            FolioReceta: m.folio,
            temporada: m.temporada,
            cantidad: m.cantidad,
            prensetacion: m.presentacion,
            metodoAplicacion: m.metodoAplicacion,
            imagenEntrega: m.imagenEntrega,
            descripcion: m.descripcion,
            fechaEntrega: m.fechaEntrega,
            status: m.status,
            respuestaSolicitud: m.respuestaSolicitud
          }
        })

        return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      }, logContext)
    })
  }

  //
  static async obtenerTablaMezclasValidados ({ status, empresa, confirmacion, idUsuario }) {
    if (!status || !empresa) {
      throw new ValidationError('Datos requeridos no proporcionados', {
        required: ['status', 'empresa'],
        received: { status, empresa }
      })
    }
    try {
      logger.info('Iniciando consulta de tablas de mezclas validadas', {
        status,
        empresa,
        confirmacion,
        userId: idUsuario
      })
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status,
          confirmacion, // Solo mezclas no confirmadas
          id: {
            [Op.ne]: 33 // Excluir ID 33
          },
          idUsuarioSolicita: {
            [Op.ne]: 33 // Excluir ID 33
          }
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
        ]
      })

      // 4. Logging de resultados encontrados
      logger.debug('Mezclas encontradas', {
        count: mezclas.length,
        empresa,
        status
      })

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        // Logging detallado para debugging
        logger.debug('Procesando mezcla', {
          id: m.id,
          usuario: m.usuario?.nombre,
          centroCoste: m.centrocoste?.centroCoste
        })
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })
      // 6. Logging final
      logger.info('Consulta completada exitosamente', {
        resultados: resultadosFormateados.length,
        empresa,
        status
      })
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (error) {
    // 8. Manejo de errores
      logger.error('Error al obtener mezclas por empresa', {
        error: error.message,
        stack: error.stack,
        params: { empresa, status, confirmacion }
      })

      // Re-throw de errores conocidos
      if (error instanceof CustomError) {
        throw error
      }

      // Error general de base de datos
      throw new DatabaseError('Error al obtener las mezclas', {
        originalError: error.message,
        context: {
          empresa,
          status,
          confirmacion
        }
      })
    }
  }

  //
  static async obtenerTablaMezclasValidadosMichoacan ({ status, confirmacion, idUsuario, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.logOperation('GET_MEZCLAS_VALIDADAS_MICHOACAN', 'started', logContext)

        // Validación de datos
        if (!status || !confirmacion) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['status', 'confirmacion'],
            received: { status, confirmacion }
          })
        }

        const mezclas = await Solicitud.findAll({
          where: {
            empresa: {
              [Op.or]: ['Moras Finas', 'Bayas del Centro']
            },
            status,
            confirmacion
          },
          include: [
            {
              model: Usuario,
              attributes: ['nombre']
            },
            {
              model: Centrocoste,
              attributes: ['centroCoste']
            }
          ],
          attributes: [
            'id', 'ranchoDestino', 'variedad', 'notaMezcla',
            'folio', 'temporada', 'cantidad', 'presentacion',
            'metodoAplicacion', 'descripcion', 'status',
            'empresa', 'fechaSolicitud', 'imagenEntrega',
            'fechaEntrega', 'respuestaSolicitud'
          ]
        })

        logger.logModelOperation('Solicitud', 'found', {
          count: mezclas.length,
          empresas: ['Moras Finas', 'Bayas del Centro']
        })

        const resultadosFormateados = mezclas.map(mezcla => {
          const m = mezcla.toJSON()
          logger.debug('Procesando mezcla', {
            id: m.id,
            usuario: m.usuario?.nombre,
            centroCoste: m.centrocoste?.centroCoste
          })

          return {
            id: m.id,
            Solicita: m.usuario?.nombre || 'Usuario no encontrado',
            fechaSolicitud: m.fechaSolicitud,
            ranchoDestino: m.ranchoDestino,
            notaMezcla: m.notaMezcla,
            empresa: m.empresa,
            centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
            variedad: m.variedad,
            FolioReceta: m.folio,
            temporada: m.temporada,
            cantidad: m.cantidad,
            prensetacion: m.presentacion,
            metodoAplicacion: m.metodoAplicacion,
            imagenEntrega: m.imagenEntrega,
            descripcion: m.descripcion,
            fechaEntrega: m.fechaEntrega,
            status: m.status,
            respuestaSolicitud: m.respuestaSolicitud
          }
        })

        logger.logOperation('GET_MEZCLAS_VALIDADAS_MICHOACAN', 'completed', {
          ...logContext,
          count: resultadosFormateados.length,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al obtener mezclas validadas de Michoacán', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  //
  static async obtenerTablaMezclasRancho ({ status, ranchoDestino, confirmacion, idUsuario, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.logOperation('GET_MEZCLAS_RANCHO_modelo', 'started', logContext)

        // Validación de datos
        if (!status || !ranchoDestino) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['status', 'ranchoDestino'],
            received: { status, ranchoDestino }
          })
        }

        const mezclas = await Solicitud.findAll({
          where: {
            ranchoDestino,
            status,
            confirmacion
          },
          include: [
            {
              model: Usuario,
              attributes: ['nombre']
            },
            {
              model: Centrocoste,
              attributes: ['centroCoste']
            }
          ],
          attributes: [
            'id', 'ranchoDestino', 'variedad', 'notaMezcla',
            'folio', 'temporada', 'cantidad', 'presentacion',
            'metodoAplicacion', 'descripcion', 'status',
            'empresa', 'fechaSolicitud', 'imagenEntrega',
            'fechaEntrega', 'respuestaSolicitud'
          ]
        })

        logger.logModelOperation('Solicitud', 'found', {
          count: mezclas.length,
          ranchoDestino,
          status
        })

        const resultadosFormateados = mezclas.map(mezcla => {
          const m = mezcla.toJSON()
          return {
            id: m.id,
            Solicita: m.usuario?.nombre || 'Usuario no encontrado',
            fechaSolicitud: m.fechaSolicitud,
            ranchoDestino: m.ranchoDestino,
            notaMezcla: m.notaMezcla,
            empresa: m.empresa,
            centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
            variedad: m.variedad,
            FolioReceta: m.folio,
            temporada: m.temporada,
            cantidad: m.cantidad,
            prensetacion: m.presentacion,
            metodoAplicacion: m.metodoAplicacion,
            imagenEntrega: m.imagenEntrega,
            descripcion: m.descripcion,
            fechaEntrega: m.fechaEntrega,
            status: m.status,
            respuestaSolicitud: m.respuestaSolicitud
          }
        })

        logger.logOperation('GET_MEZCLAS_RANCHO', 'completed', {
          ...logContext,
          count: resultadosFormateados.length,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al obtener mezclas por rancho', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async obtenerTablaMezclasUsuario ({ status, idUsuarioSolicita, confirmacion, logContext, logger }) {
    try {
      logger.logOperation('GET_MEZCLAS_USUARIO_modelo', 'started', logContext)

      // Validación de datos
      if (!status || !idUsuarioSolicita) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['status', 'idUsuarioSolicita'],
          received: { status, idUsuarioSolicita }
        })
      }

      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status,
          confirmacion
        },
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          },
          {
            model: Centrocoste,
            attributes: ['centroCoste']
          }
        ],
        attributes: [
          'id', 'ranchoDestino', 'variedad', 'notaMezcla',
          'folio', 'temporada', 'cantidad', 'presentacion',
          'metodoAplicacion', 'descripcion', 'status',
          'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega',
          'respuestaSolicitud', 'respuestaMezclador'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        solicitudId: idUsuarioSolicita,
        count: mezclas.length
      })

      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario?.nombre || 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud,
          respuestaMezclador: m.respuestaMezclador
        }
      })

      logger.logOperation('GET_MEZCLAS_USUARIO', 'completed', {
        ...logContext,
        count: resultadosFormateados.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener mezclas de usuario', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  static async obtenerTablaMezclasCancelada ({ idUsuario, confirmacion, rol, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      let mezclas
      try {
        logger.logOperation('GET_MEZCLAS_CANCELADAS', 'started', logContext)

        if (!idUsuario || !rol) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['idUsuario', 'rol'],
            received: { idUsuario, rol }
          })
        }

        const queryConfig = {
          where: { confirmacion },
          include: [
            {
              model: Usuario,
              attributes: ['nombre']
            },
            {
              model: Centrocoste,
              attributes: ['centroCoste']
            }
          ],
          attributes: [
            'id', 'ranchoDestino', 'variedad', 'notaMezcla',
            'folio', 'temporada', 'cantidad', 'presentacion',
            'metodoAplicacion', 'descripcion', 'status',
            'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega',
            'respuestaSolicitud', 'respuestaMezclador', 'motivoCancelacion'
          ]
        }

        if (rol === 'adminMezclador') {
          queryConfig.where.idUsuarioValida = idUsuario
        } else if (rol === 'solicita' || rol === 'solicita2') {
          queryConfig.where.idUsuarioSolicita = idUsuario
        } else if (rol !== 'administrativo') {
          throw new ValidationError('Rol no válido')
        }

        mezclas = await Solicitud.findAll(queryConfig)

        logger.logModelOperation('Solicitud', 'found', {
          count: mezclas.length,
          rol,
          userId: idUsuario
        })

        const resultadosFormateados = mezclas.map(mezcla => {
          const m = mezcla.toJSON()
          return {
            id: m.id,
            Solicita: m.usuario?.nombre || 'Usuario no encontrado',
            fechaSolicitud: m.fechaSolicitud,
            ranchoDestino: m.ranchoDestino,
            notaMezcla: m.notaMezcla,
            empresa: m.empresa,
            centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
            variedad: m.variedad,
            FolioReceta: m.folio,
            temporada: m.temporada,
            cantidad: m.cantidad,
            prensetacion: m.presentacion,
            metodoAplicacion: m.metodoAplicacion,
            imagenEntrega: m.imagenEntrega,
            descripcion: m.descripcion,
            fechaEntrega: m.fechaEntrega,
            status: m.status,
            motivoCancelacion: m.motivoCancelacion
          }
        })

        logger.logOperation('GET_MEZCLAS_CANCELADAS', 'completed', {
          ...logContext,
          count: resultadosFormateados.length,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al obtener mezclas canceladas', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  //
  static async obtenerTablaMezclasId ({ id, usuario, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.logOperation('GET_MEZCLA_BY_ID_modelo', 'started', logContext)

        // Validación de datos
        if (!id || !usuario) {
          throw new ValidationError('Datos requeridos no proporcionados', {
            required: ['id', 'usuario'],
            received: { id: !!id, usuario: !!usuario }
          })
        }

        // Consulta de mezclas
        const mezclas = await Solicitud.findAll({
          where: { id },
          include: [
            {
              model: Usuario,
              attributes: ['nombre']
            },
            {
              model: Centrocoste,
              attributes: ['centroCoste']
            }
          ],
          attributes: [
            'id', 'ranchoDestino', 'variedad', 'folio',
            'temporada', 'cantidad', 'presentacion',
            'metodoAplicacion', 'descripcion', 'status',
            'empresa', 'fechaSolicitud', 'imagenSolicitud'
          ]
        })

        logger.logModelOperation('Solicitud', 'found', {
          solicitudId: id,
          count: mezclas.length
        })

        const resultadosFormateados = mezclas.map(mezcla => {
          const m = mezcla.toJSON()
          logger.debug('Procesando mezcla', {
            id: m.id,
            usuario: m.usuario?.nombre,
            centroCoste: m.centrocoste?.centroCoste
          })

          return {
            id: m.id,
            Solicita: m.usuario?.nombre || 'Usuario no encontrado',
            fechaSolicitud: m.fechaSolicitud,
            ranchoDestino: m.ranchoDestino,
            empresa: m.empresa,
            centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
            variedad: m.variedad,
            FolioReceta: m.folio,
            temporada: m.temporada,
            cantidad: m.cantidad,
            prensetacion: m.presentacion,
            metodoAplicacion: m.metodoAplicacion,
            imagen: m.imagenSolicitud,
            descripcion: m.descripcion,
            status: m.status
          }
        })

        logger.logOperation('GET_MEZCLA_BY_ID', 'completed', {
          ...logContext,
          count: resultadosFormateados.length,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al obtener mezcla por ID', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  //
  static async obtenerTablaMezclasJalisco ({ status, confirmacion }) {
    const logContext = {
      operation: 'GET_MEZCLAS_JALISCO',
      status,
      confirmacion,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_MEZCLAS_JALISCO', 'started', logContext)

      // Validar datos
      if (!status) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['status'],
          received: { status }
        })
      }

      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino: {
            [Op.or]: ['', 'La Loma', 'Zapote', 'Ojo de Agua']
          },
          status,
          confirmacion
        },
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          },
          {
            model: Centrocoste,
            attributes: ['centroCoste']
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        count: mezclas.length,
        ranchos: ['La Loma', 'Zapote', 'Ojo de Agua']
      })

      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        logger.debug('Procesando mezcla', {
          id: m.id,
          usuario: m.usuario?.nombre,
          centroCoste: m.centrocoste?.centroCoste
        })

        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })

      logger.logOperation('GET_MEZCLAS_JALISCO', 'completed', {
        ...logContext,
        count: resultadosFormateados.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener mezclas de Jalisco', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async obtenerPorcentajes ({ id }) {
    const logContext = {
      operation: 'GET_PORCENTAJES',
      solicitudId: id,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_PORCENTAJES', 'started', logContext)

      if (!id) {
        throw new ValidationError('ID es requerido', {
          required: ['id'],
          received: { id }
        })
      }

      const mezclas = await Solicitud.findAll({
        where: { id },
        attributes: ['porcentajes', 'variedad']
      })

      logger.logModelOperation('Solicitud', 'found', {
        solicitudId: id,
        count: mezclas.length
      })

      if (mezclas.length === 0) {
        throw new NotFoundError('No se encontraron mezclas', {
          solicitudId: id
        })
      }

      logger.logOperation('GET_PORCENTAJES', 'completed', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(mezclas) ? mezclas : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener porcentajes', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async obtenerDatosSolicitud ({ id }) {
    const logContext = {
      operation: 'GET_DATOS_SOLICITUD',
      solicitudId: id,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_DATOS_SOLICITUD', 'started', logContext)

      if (!id) {
        throw new ValidationError('ID es requerido', {
          required: ['id'],
          received: { id }
        })
      }

      const mezclas = await Solicitud.findAll({
        where: { id },
        attributes: [
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        solicitudId: id,
        count: mezclas.length
      })

      logger.logOperation('GET_DATOS_SOLICITUD', 'completed', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(mezclas) ? mezclas : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener datos de solicitud', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async getOneSolicita ({ id, idSolicita }) {
    const logContext = {
      operation: 'GET_ONE_SOLICITA',
      solicitudId: id,
      userId: idSolicita,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_ONE_SOLICITA', 'started', logContext)

      if (!id || !idSolicita) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['id', 'idSolicita'],
          received: { id, idSolicita }
        })
      }

      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioSolicita: idSolicita
        },
        attributes: [
          'idUsuarioMezcla',
          'respuestaMezclador'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        solicitudId: id,
        encontrado: !!solicitud
      })

      if (!solicitud) {
        throw new NotFoundError('No se encontraron respuestas del mezclador', {
          solicitudId: id,
          idSolicita
        })
      }

      logger.logOperation('GET_ONE_SOLICITA', 'completed', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return solicitud
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener respuesta del mezclador', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async getOneMezclador ({ id, idSolicita }) {
    const logContext = {
      operation: 'GET_ONE_MEZCLADOR',
      solicitudId: id,
      mezcladorId: idSolicita,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_ONE_MEZCLADOR', 'started', logContext)

      if (!id || !idSolicita) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['id', 'idSolicita'],
          received: { id, idSolicita }
        })
      }

      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioMezcla: idSolicita
        },
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          },
          {
            model: Centrocoste,
            attributes: ['centroCoste']
          }
        ],
        attributes: [
          'id',
          'folio',
          'ranchoDestino',
          'variedad',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'empresa',
          'fechaSolicitud',
          'respuestaSolicitud',
          'respuestaMezclador'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        solicitudId: id,
        encontrado: !!solicitud
      })

      if (!solicitud) {
        throw new NotFoundError('No se encontró la mezcla especificada', {
          solicitudId: id,
          mezcladorId: idSolicita
        })
      }

      const resultadoFormateado = {
        id: solicitud.id,
        Solicita: solicitud.usuario?.nombre || 'Usuario no encontrado',
        fechaSolicitud: solicitud.fechaSolicitud,
        ranchoDestino: solicitud.ranchoDestino,
        empresa: solicitud.empresa,
        centroCoste: solicitud.centrocoste?.centroCoste || 'Centro no encontrado',
        variedad: solicitud.variedad,
        FolioReceta: solicitud.folio,
        temporada: solicitud.temporada,
        cantidad: solicitud.cantidad,
        prensetacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion,
        descripcion: solicitud.descripcion,
        respuestaSolicitud: solicitud.respuestaSolicitud,
        respuestaMezclador: solicitud.respuestaMezclador
      }

      logger.logOperation('GET_ONE_MEZCLADOR', 'completed', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return {
        message: 'Mezcla obtenida correctamente',
        data: resultadoFormateado
      }
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener mezcla', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  //
  static async getAllGeneral ({ status, confirmacion, idUsuario }) {
    const logContext = {
      operation: 'GET_ALL_GENERAL',
      status,
      confirmacion,
      userId: idUsuario,
      timestamp: new Date().toISOString()
    }

    try {
      logger.logOperation('GET_ALL_GENERAL', 'started', logContext)

      if (!status || !confirmacion || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados', {
          required: ['status', 'confirmacion', 'idUsuario'],
          received: { status, confirmacion, idUsuario }
        })
      }

      const mezclas = await Solicitud.findAll({
        where: { status, confirmacion },
        include: [
          {
            model: Usuario,
            attributes: ['nombre']
          },
          {
            model: Centrocoste,
            attributes: ['centroCoste']
          }
        ],
        attributes: [
          'id', 'ranchoDestino', 'variedad', 'notaMezcla',
          'folio', 'temporada', 'cantidad', 'presentacion',
          'metodoAplicacion', 'descripcion', 'status',
          'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega'
        ]
      })

      logger.logModelOperation('Solicitud', 'found', {
        count: mezclas.length,
        status,
        confirmacion
      })

      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario?.nombre || 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste?.centroCoste || 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      logger.logOperation('GET_ALL_GENERAL', 'completed', {
        ...logContext,
        count: resultadosFormateados.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new DatabaseError('Error al obtener mezclas generales', {
        originalError: error.message,
        context: logContext
      })
    }
  }

  // Métodos auxiliares y utilitarios
  static #validarDatosEntrada ({ data, idUsuario }) {
    const errores = []
    // Validar que los datos requeridos estén presentes
    if (!data) {
      errores.push('la data es requerida')
    }

    if (!idUsuario) {
      errores.push('El campo idUsuario es requerido')
    }

    if (errores.length > 0) {
      throw new ValidationError('Datos requeridos no proporcionados', {
        errores,
        received: data
      })
    }
  }

  static async #procesarVariedades ({ data, transaction }) {
    if (data.variedad !== 'todo') {
      return {
        variedad: data.variedad,
        porcentajes: '100'
      }
    }

    const variedades = await CentroCosteModel.getVariedadPorCentroCoste({
      id: data.centroCoste
    })

    const { variedadesFiltradas, porcentajesFiltrados } = this.#filtrarVariedades(
      variedades[0].dataValues
    )

    return {
      variedad: variedadesFiltradas.join(','),
      porcentajes: porcentajesFiltrados.join(',')
    }
  }

  static #filtrarVariedades (datos) {
    const variedadesArray = datos.variedad.split(',').slice(0, -1)
    const porcentajesArray = datos.porcentajes.split(',').slice(0, -1)

    return variedadesArray.reduce((acc, variedad, index) => {
      if (parseInt(porcentajesArray[index].trim()) !== 0) {
        acc.variedadesFiltradas.push(variedad)
        acc.porcentajesFiltrados.push(porcentajesArray[index])
      }
      return acc
    }, { variedadesFiltradas: [], porcentajesFiltrados: [] })
  }

  static #procesarProductos = async ({ productos, idSolicitud, transaction }) => {
    const productosValidos = productos.filter(producto =>
      producto.id_producto &&
      producto.unidad_medida &&
      producto.cantidad
    )
    // Validar que haya productos
    if (productosValidos.length === 0) {
      throw new ValidationError('No se encontraron productos válidos para procesar')
    }

    return Promise.all(productosValidos.map(async (producto, index) => {
      const productoData = {
        id_solicitud: idSolicitud,
        id_producto: parseInt(producto.id_producto),
        unidad_medida: producto.unidad_medida,
        cantidad: producto.cantidad
      }
      await SolicitudProductos.create(productoData, { transaction })
    }))
  }

  static #crearSolicitudBase = async ({ data, variedad, porcentajes, idUsuario, rol, transaction }) => {
    let solicitudData = {}
    // Validar que los datos para darle autorizacion especial adminMezclador
    // estas mesclaz pasan autorizadas
    if (rol === 'adminMezclador') {
      solicitudData = {
        idUsuarioSolicita: idUsuario,
        cantidad: data.cantidad || null,
        idCentroCoste: data.centroCoste,
        empresa: data.empresaPertece,
        folio: data.folio || '',
        metodoAplicacion: data.metodoAplicacion || null,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho,
        temporada: data.temporada,
        variedad,
        descripcion: data.descripcion || null,
        porcentajes,
        confirmacion: 'Confirmada'
      }
    } else {
      solicitudData = {
        idUsuarioSolicita: idUsuario,
        cantidad: data.cantidad || null,
        idCentroCoste: data.centroCoste,
        empresa: data.empresaPertece,
        folio: data.folio || '',
        metodoAplicacion: data.metodoAplicacion || null,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho,
        temporada: data.temporada,
        variedad,
        descripcion: data.descripcion || null,
        porcentajes
      }
    }
    return Solicitud.create(solicitudData, { transaction })
  }

  // Métodos auxiliares para cerrarSolicitud
  static #validarDatosCierre ({ data, idUsuario }) {
    const errores = []

    if (!idUsuario) {
      errores.push('El ID de usuario es requerido')
    }

    if (!data?.idSolicitud) {
      errores.push('El ID de solicitud es requerido')
    }

    if (!data?.imagen) {
      errores.push('La imagen de entrega es requerida')
    }

    if (errores.length > 0) {
      throw new ValidationError('Datos requeridos no proporcionados', {
        errores,
        received: {
          idUsuario,
          idSolicitud: data?.idSolicitud,
          tieneImagen: !!data?.imagen
        }
      })
    }
  }

  static async #buscarSolicitud ({ id, transaction }) {
    const solicitud = await Solicitud.findByPk({ id }, { transaction })
    if (!solicitud) {
      if (!solicitud) {
        throw new NotFoundError(`Solicitud con ID ${id} no encontrada`, {
          solicitudId: id
        })
      }
    }
    return solicitud
  }

  static async #actualizarSolicitud ({ solicitud, data, idUsuario, transaction, logContext }) {
    try {
      const cambios = {
        status: 'Completada',
        idUsuarioMezcla: idUsuario,
        fechaEntrega: data.fecha || new Date()
      }

      if (data.imagenPath) {
        const { relativePath } = await this.#procesarImagen({ imagen: data.imagenPath })
        cambios.imagenEntrega = relativePath
      }

      Object.assign(solicitud, cambios)

      await solicitud.save({ transaction })

      return {
        solicitudActualizada: solicitud,
        cambiosRealizados: cambios
      }
    } catch (error) {
      logger.error('Error al actualizar solicitud', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  }

  static async #procesarImagen ({ imagen }) {
    try {
      const response = await guardarImagen({ imagen })

      if (!response?.relativePath) {
        throw new Error('No se pudo guardar la imagen')
      }

      return response
    } catch (error) {
      throw new DatabaseError('Error al procesar la imagen', {
        originalError: error.message
      })
    }
  }

  static async #notificarCierreSolicitud ({ solicitud, idUsuario }) {
    try {
      const solicitante = await UsuarioModel.getOneId({
        id: solicitud.idUsuarioSolicita
      })

      if (solicitante?.email) {
        await enviarCorreo({
          type: 'cierre_solicitud',
          email: solicitante.email,
          nombre: solicitante.nombre,
          solicitudId: solicitud.id,
          data: {
            fechaEntrega: solicitud.fechaEntrega,
            status: solicitud.status
          }
        })
      }
    } catch (error) {
      logger.warn('Error al enviar notificación de cierre', {
        error: error.message,
        solicitudId: solicitud.id,
        userId: idUsuario
      })
    // No lanzamos el error para no interrumpir el flujo principal
    }
  }

  static async #procesarSolicitud ({ estado, idUsuario, user, transaction }) {
    const solicitud = await Solicitud.findByPk(estado.id_solicitud)
    if (!solicitud) {
      throw new NotFoundError(`Solicitud ${estado.id_solicitud} no encontrada`)
    }

    solicitud.confirmacion = estado.validacion === false ? 'Cancelada' : solicitud.confirmacion
    solicitud.idUsuarioValida = idUsuario
    solicitud.motivoCancelacion = estado.motivo || null

    await solicitud.save({ transaction })

    if (estado.validacion === false) {
      await NotificacionModel.create({
        idSolicitud: solicitud.id,
        mensaje: `Solicitud ${solicitud.id} cancelada: ${estado.motivo || 'Sin motivo especificado'}`,
        idUsuario: solicitud.idUsuarioSolicita
      }, { transaction })
    }

    return {
      id: solicitud.id,
      status: 'Procesado',
      message: estado.validacion ? 'Validación exitosa' : 'Solicitud cancelada'
    }
  }

  static async #ejecutarConsulta (operacion, callback, logContext) {
    try {
      logger.logOperation(operacion, 'started', logContext)

      const resultado = await callback()

      logger.logOperation(operacion, 'completed', {
        ...logContext,
        count: Array.isArray(resultado) ? resultado.length : 1,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return resultado
    } catch (error) {
      logger.logError(error, {
        ...logContext,
        stack: error.stack
      })

      if (error instanceof CustomError) throw error

      throw new MezclaOperationError('QUERY', `Error al ejecutar consulta ${operacion}`, {
        originalError: error.message,
        context: logContext
      })
    }
  }
} // fin modelo

// Función auxiliar para procesar cada solicitud
/**
 * Procesa una solicitud de mezcla
 * @param {Object} params Parámetros de la solicitud
 * @param {string} params.estado Estado actual de la solicitud
 * @param {number} params.idUsuario ID del usuario que procesa
 * @returns {Promise<Object>} Resultado del procesamiento
 * @throws {ValidationError} Si los datos son inválidos
 */
async function procesarSolicitud ({ estado, idUsuario, user, transaction }) {
  // Buscar la solicitud
  const solicitud = await Solicitud.findByPk(estado.id_solicitud)
  if (!solicitud) {
    throw new NotFoundError(`Solicitud ${estado.id_solicitud} no encontrada`, {
      id: estado.id_solicitud,
      userId: idUsuario,
      user: user.nombre
    })
  }

  // Actualizar solicitud
  solicitud.confirmacion = estado.validacion === true ? 'Confirmada' : solicitud.confirmacion
  solicitud.idUsuarioValida = idUsuario
  await solicitud.save({ transaction })

  // Obtener mezclador según la empresa
  let mezclador
  if (solicitud.empresa === 'Moras Finas' || solicitud.empresa === 'Bayas del Centro') {
    mezclador = await UsuarioModel.getUserEmail({
      rol: 'mezclador',
      empresa: solicitud.empresa
    })
  } else {
    mezclador = await UsuarioModel.getUserEmailRancho({
      rol: 'mezclador',
      empresa: solicitud.empresa,
      rancho: solicitud.ranchoDestino
    })
  }

  // Obtener solicitante
  const solicitante = await UsuarioModel.getOneId({
    id: solicitud.idUsuarioSolicita
  })

  // Enviar correos si se tienen los datos necesarios
  if (mezclador?.[0] && solicitante) {
    let respues
    logger.info(`nombre solicitante:${solicitante.nombre}, correo:${solicitante.email}`)

    // enviar correo a todos los mezcladores
    mezclador.map(async (mezclador) => {
      logger.info(`nombre mezclador:${mezclador.nombre}, correo:${mezclador.email}`)

      respues = await enviarCorreo({
        type: 'solicitud',
        email: mezclador.email,
        nombre: mezclador.nombre,
        solicitudId: solicitud.id,
        fechaSolicitud: format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss'),
        data: solicitud,
        usuario: {
          nombre: solicitante.nombre,
          empresa: solicitante.empresa,
          ranchos: solicitud.ranchoDestino
        }
      })
    })

    const respuesSolicitante = await enviarCorreo({
      type: 'aprobada',
      email: solicitante.email,
      nombre: solicitante.nombre,
      solicitudId: solicitud.id,
      usuario: {
        empresa: solicitante.empresa,
        ranchos: solicitud.ranchoDestino
      },
      data: {
        folio: solicitud.folio,
        cantidad: solicitud.cantidad,
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion
      }
    })
    if (respues.error) {
      logger.error('Error al enviar correo:', respues.error)
    } else {
      logger.info('Correo enviado:', respues.messageId)
    }
    if (respuesSolicitante.error) {
      logger.error('Error al enviar correo:', respuesSolicitante.error)
    } else {
      logger.info('Correo enviado:', respuesSolicitante.messageId)
    }
  }

  return {
    idSolicitud: estado.id_solicitud,
    empresa: solicitud.empresa,
    status: 'procesado'
  }
}

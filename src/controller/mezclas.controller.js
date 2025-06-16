import { enviarCorreo } from '../config/smtp.js'
import { UsuarioModel } from '../models/usuario.models.js'
// utils
import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
import loggerWiston from '../utils/logger.js'
import { format } from 'date-fns'

export class MezclasController {
  constructor ({ mezclaModel }) {
    this.mezclaModel = mezclaModel
  }

  // crear solicitudes
  create = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger // Logger con correlación

    const logContext = {
      operation: 'CREATE_MEZCLA',
      userId: user.id,
      userRole: user.rol,
      name: user.nombre,
      requestBody: {
        ...req.body,
        // Truncar datos sensibles o muy largos
        productos: req.body.productos?.length
      }
    }
    try {
      // Inicio de operación
      logger.info('Iniciando creación de mezcla', logContext)

      // Validación de datos
      this.#validarDatosCreacion(req.body)

      // pasamos los datos de la solicitud al modelo
      const result = await this.mezclaModel.create({
        data: req.body,
        idUsuario: user.id,
        rol: user.rol,
        logContext,
        logger
      })

      // Log de procesamiento
      logger.debug('Procesando notificaciones', {
        ...logContext,
        solicitudId: result.idSolicitud
      })

      // Proceso de notificaciones por correo
      const notificationTargets = await this.#determinarDestinatariosNotificacion({
        rancho: req.body.rancho,
        empresa: req.body.empresaPertece,
        user,
        result
      })

      logger.info('Notificaciones enviadas', {
        ...logContext,
        ...notificationTargets
      })

      await this.#enviarCorreoNotificacion({
        ...notificationTargets,
        solicitud: result,
        user,
        requestData: req.body,
        logger,
        logContext
      })

      // Log de finalización
      logger.info('Mezcla creada exitosamente', {
        ...logContext,
        solicitudId: result.idSolicitud,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.status(201).json({
        message: result.message,
        idSolicitud: result.idSolicitud
      })
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mezcla', {
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
  })

  // registrar solicitudes completadas
  registrarSolicitud = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger // Logger con correlación

    const logContext = {
      operation: 'REGISTRAR_SOLICITUD_MEZCLA',
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: {
        ...req.body,
        // Truncar la imagen en el log
        imagen: req.body.imagen ? this.truncateBase64(req.body.imagen) : null
      }
    }
    try {
      // Inicio de operación
      logger.info('Iniciando registro de mezcla', logContext)

      // Validación de datos
      this.#validarDatosRegistro(req.body)

      const result = await this.mezclaModel.registrarSolicitud({
        data: req.body,
        idUsuario: user.id
      })
      // Log de finalización
      logger.info('Mezcla creada exitosamente', {
        ...logContext,
        solicitudId: result.idSolicitud,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.status(201).json({
        message: result.message,
        idSolicitud: result.idSolicitud
      })
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mezcla', {
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
  })

  //
  estadoProceso = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { idSolicitud } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'UPDATE_MEZCLA_STATUS_PROCESO',
      solicitudId: idSolicitud,
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      // Validación inicial
      this.#validarRolYPermisos(user, 'UPDATE_MEZCLAS')

      this.#validarDatosActualizacionEstado(req.body)

      logger.info('Iniciando actualización de estado', logContext)

      // Actualizar estado
      const result = await this.mezclaModel.estadoProceso({
        id: idSolicitud,
        data: req.body,
        usuario: user,
        logContext,
        logger
      })

      logger.debug('Estado actualizado, obteniendo información del solicitante', {
        ...logContext,
        nuevoEstado: req.body.status
      })

      // Obtener información del solicitante
      const solicitante = await UsuarioModel.getOneId({
        id: result.idUsuarioSolicita
      })

      if (!solicitante) {
        throw new ValidationError('No se encontró el solicitante')
      }

      // Enviar notificación
      logger.debug('Enviando notificación por correo', {
        ...logContext,
        solicitante: {
          id: solicitante.id,
          email: solicitante.email
        }
      })

      await enviarCorreo({
        type: 'status',
        email: solicitante.email,
        nombre: solicitante.nombre,
        solicitudId: idSolicitud,
        status: req.body.status,
        usuario: user,
        data: {
          observaciones: req.body.observaciones,
          fecha: new Date().toISOString()
        }
      })

      logger.info('Estado actualizado exitosamente', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
          status: result.status,
          updatedAt: result.updatedAt
        }
      })
    } catch (error) {
      logger.error('Error al actualizar estado', {
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
  })

  cerrarSolicitid = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'CLOSE_SOLICITUD',
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: {
        ...req.body,
        // Truncar la imagen en el log
        imagen: req.body.imagen ? this.truncateBase64(req.body.imagen) : null
      }
    }
    try {
      logger.info('Iniciando actualización de estado', logContext)

      const result = await this.mezclaModel.cerrarSolicitud({
        data: req.body,
        idUsuario: user.id,
        logContext,
        logger
      })

      logger.debug('Solicitud cerrada exitosamente', {
        resultado: result.message,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      const solicitante = await UsuarioModel.getOneId({ id: result.idUsuarioSolicita })

      logger.debug('Notificación enviada', {
        solicitante: {
          id: solicitante.id,
          email: solicitante.email
        }
      })

      await enviarCorreo({
        type: 'status',
        email: solicitante.email,
        nombre: solicitante.nombre,
        solicitudId: result.id,
        status: result.status,
        usuario: user,
        data: {
          rancho: result.rancho || req.body.rancho,
          descripcion: result.descripcion || req.body.descripcion,
          folio: result.folio || req.body.folio
        }
      })

      logger.info('Operación cerrar solicitud exitosa', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({
        success: true,
        message: result.message
      })
    } catch (error) {
      logger.error('Error al cerrar solicitud', {
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
  })

  //
  notificacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud
    const { mensajes, idMesclador } = req.body
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'ENVIAR_NOTIFICATION',
      solicitudId: idSolicitud,
      userId: user.id,
      userRole: user.rol,
      name: user.nombre,
      mezcladorId: idMesclador,
      requestBody: req.body
    }

    try {
      logger.info('ENVIAR_NOTIFICATION started', logContext)

      const result = await this.mezclaModel.mensajeSolicita({
        id: idSolicitud,
        mensajes,
        idUsuario: idMesclador,
        logContext,
        logger
      })

      const mezclador = await UsuarioModel.getOneId({ id: idMesclador })

      req.logger.info('ENVIAR_NOTIFICATION', 'sending_email', {
        mezclador: {
          id: mezclador.id,
          email: mezclador.email
        }
      })

      await enviarCorreo({
        type: 'respuestaSolicitante',
        email: mezclador.email,
        nombre: user.nombre,
        solicitudId: idSolicitud,
        usuario: {
          empresa: user.empresa,
          ranchos: user.ranchos
        },
        data: { mensaje: mensajes }
      })

      logger.info('ENVIAR_NOTIFICATION', 'completed', {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({
        success: true,
        message: result.message
      })
    } catch (error) {
      logger.error('Error al actualizar estado', {
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
  })

  obtenerTablaMezclasEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { status } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'GET_MEZCLAS_EMPRESA',
      userId: user.id,
      userRole: user.rol,
      name: user.nombre,
      status,
      empresa: user.empresa,
      rancho: user.ranchos,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId // Añadir ID de correlación
    }

    try {
      logger.info('Iniciando obtención de mezclas', logContext)

      // Validación inicial
      if (!status) {
        logger.warn('Status no proporcionado', logContext)
        throw new ValidationError('El estado es requerido')
      }

      // Parámetros base
      const params = {
        status,
        confirmacion: 'Confirmada',
        idUsuario: user.id
      }

      // Obtener resultados según rol
      const result = await this.#obtenerMezclasSegunRol(user, params, logContext, logger)

      // Log de finalización
      logger.info('Consulta completada exitosamente', {
        resultCount: Array.isArray(result) ? result.length : 1,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(result.data || result)
    } catch (error) {
      logger.error('Error al obtener mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  //
  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const { user } = req.session
    const id = req.params.id
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'Obtener mesclas por id',
      username: user.nombre,
      userId: user.id,
      userRole: user.rol,
      mezclasId: id
    }

    try {
      logger.info('Obtener mesclas por id', 'started', logContext)

      const result = await this.mezclaModel.obtenerTablaMezclasId({
        id,
        usuario: user.nombre,
        logContext,
        logger
      })

      logger.info('Obtener mesclas por id', 'completed', {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(result.data)
    } catch (error) {
      logger.error('Error al obtener mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  //
  obtenerTablasConfirmar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'GET_TABLAS_CONFIRMAR',
      userId: user.id,
      username: user.nombre,
      userRole: user.rol,
      userEmpresa: user.empresa
    }

    try {
      logger.info('GET_TABLAS_CONFIRMAR started', logContext)

      let result = []
      const confirmacion = 'Pendiente'

      if (user.rol === 'adminMezclador' && user.empresa === 'General') {
        logger.info('GET_TABLAS_CONFIRMAR', 'fetching_michoacan')

        const [res2, res1] = await Promise.all([
          this.mezclaModel.obtenerTablaMezclasValidadosMichoacan({
            status: 'Pendiente',
            confirmacion,
            idUsuario: user.id,
            logContext,
            logger
          }),
          this.mezclaModel.obtenerTablaMezclasRancho({
            status: 'Pendiente',
            ranchoDestino: 'Ahualulco',
            confirmacion,
            idUsuario: user.id,
            logContext,
            logger
          })
        ])

        if (Array.isArray(res2)) result = result.concat(res2)
        if (Array.isArray(res1)) result = result.concat(res1)
      } else if (user.rol === 'adminMezclador' && user.empresa === 'Bioagricultura') {
        logger.info('GET_TABLAS_CONFIRMAR fetching_bioagricultura', logContext)

        const [res2, res1] = await Promise.all([
          this.mezclaModel.obtenerTablaMezclasRancho({
            status: 'Pendiente',
            ranchoDestino: 'Atemajac',
            confirmacion,
            idUsuario: user.id,
            logContext,
            logger
          }),
          this.mezclaModel.obtenerTablaMezclasUsuario({
            status: 'Pendiente',
            idUsuarioSolicita: user.id,
            confirmacion,
            logContext,
            logger
          })
        ])

        if (Array.isArray(res2)) result = result.concat(res2)
        if (Array.isArray(res1)) result = result.concat(res1)
      }

      const uniqueResults = this.#eliminarDuplicados(result)

      logger.info('GET_TABLAS_CONFIRMAR', 'completed', {
        resultCount: uniqueResults.length,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(uniqueResults)
    } catch (error) {
      logger.error('Error al obtener mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  //
  mezclaConfirmar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'CONFIRM_MEZCLA',
      userId: user.id,
      userRole: user.rol,
      username: user.nombre,
      solicitudId: idSolicitud,
      requestBody: req.body
    }

    try {
      logger.info('CONFIRM_MEZCLA started', logContext)

      const response = await this.mezclaModel.mezclaConfirmar({
        idSolicitud,
        data: req.body,
        usuario: user,
        logContext,
        logger
      })

      logger.info('CONFIRM_MEZCLA completed', {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({
        success: true,
        message: response.message
      })
    } catch (error) {
      logger.error('Error al obtener mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  obtenerTablasCancelada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'GET_CANCELLED_MEZCLAS',
      username: user.nombre,
      userId: user.id,
      userRole: user.rol
    }

    try {
      logger.info('GET_CANCELLED_MEZCLAS started', logContext)

      const confirmacion = 'Cancelada'
      const resultado = await this.mezclaModel.obtenerTablaMezclasCancelada({
        confirmacion,
        idUsuario: user.id,
        rol: user.rol,
        logContext,
        logger
      })

      logger.info('GET_CANCELLED_MEZCLAS completed', {
        resultCount: Array.isArray(resultado) ? resultado.length : 0,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(resultado)
    } catch (error) {
      logger.error('Error al obtener mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  validacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const data = req.body
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'VALIDATE_MEZCLA',
      username: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: data
    }
    try {
      logger.info('VALIDATE_MEZCLA started', logContext)

      const result = await this.mezclaModel.validacion({
        data,
        idUsuario: user.id,
        user,
        logContext,
        logger
      })

      logger.info('VALIDATE_MEZCLA', 'completed', {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(result)
    } catch (error) {
      logger.error('Error al validar mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  cancelar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud
    const data = req.body
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'CANCEL_MEZCLA',
      username: user.nombre,
      userId: user.id,
      solicitudId: idSolicitud,
      requestBody: data
    }

    try {
      logger.info('CANCEL_MEZCLA INICIADO', logContext)

      const result = await this.mezclaModel.cancelar({
        idSolicitud,
        data,
        idUsuario: user.id,
        logContext,
        logger
      })

      logger.info('CANCEL_MEZCLA COMPLETADO', {
        ...logContext,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json(result)
    } catch (error) {
      logger.error('Error al cancelar mezclas', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  // funciones auxiliares y utilitarios
  #determinarDestinatariosNotificacion = async ({ rancho, empresa, user, result }) => {
    let ress = []
    // ranchos validar
    try {
      loggerWiston.debug('Determinando destinatarios de notificación iniciada')
      if (rancho === 'Atemajac') {
        if (user.rol === 'adminMezclador' && user.id === 33) {
          // Si el usuario es adminMezclador y es de Bioagricultura
          // obtenemos los emails de todos los mezcladores de la empresa
          const r1 = await UsuarioModel.getUserEmailRanchoRol({ rol: 'mezclador', rancho: 'Atemajac' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r1]
        } else {
          const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' }) // idUsuario: 33 es el id de Francisco Alvarez
          ress = [...r3]
        }
      } else if (rancho === 'Seccion 7 Fresas') {
        const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' }) // idUsuario: 33 es el id de Francisco Alvarez
        ress = [...r3]
      } else if (rancho === 'Romero' || rancho === 'Potrero' || rancho === 'Casas de Altos' || rancho === 'Santiaguillo' || rancho === 'Rincon' || rancho === 'Paraiso' || rancho === 'Guzman' || rancho === 'Chivas' || rancho === 'Jimenez') {
        let r3 = []
        if (user.rol === 'adminMezclador' && user.id === 33) {
          // Si el usuario es adminMezclador y es Francisco Alvarez
          // obtenemos los emails de todos los mezcladores de la empresa
          r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa }) // idUsuario: 33 es el id de Francisco Alvarez
        } else {
          r3 = await UsuarioModel.getUserEmailGerente({ rol: 'adminMezclador', idUsuario: 51 }) // idUsuario: 48 es el id de abigail ortiz
        }
        ress = [...r3]
      } else if (rancho === 'La Loma' || rancho === 'Zapote' || rancho === 'Ojo de Agua') {
        const r1 = await UsuarioModel.getUserEmailGerente({ rol: 'adminMezclador', idUsuario: 51 }) // idUsuario: 48 es el id de abigail ortiz
        ress = [...r1]
      } else if (rancho === 'Ahualulco') {
        const r2 = await UsuarioModel.getUserEmailGerente({ rol: 'adminMezclador', idUsuario: 51 }) // idUsuario: 48 es el id de abigail ortiz
        ress = [...r2]
      }
      loggerWiston.debug('Determinando destinatarios de notificación finalizada', ress)
      return { ress } || []
    } catch (error) {
      loggerWiston.error('Error al determinar destinatarios de notificación', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw new ValidationError('Error al determinar destinatarios de notificación')
    }
  }

  #enviarCorreoNotificacion = async ({ ress, solicitud, user, requestData, logger, logContext }) => {
    logger.info('Enviando correo de notificación iniciado', logContext)
    // Usar forEach para mapear los resultados
    if (user.rol === 'adminMezclador') {
      ress.forEach(async usuario => {
        loggerWiston.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'solicitud',
          email: usuario.email,
          nombre: usuario.nombre,
          solicitudId: solicitud.idSolicitud,
          fechaSolicitud: format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss'),
          data: requestData,
          usuario: {
            nombre: user.nombre,
            empresa: user.empresa,
            ranchos: requestData.rancho
          }
        })
        // validamos los solicitudados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
          return false
        } else {
          logger.info('Correo enviado:', respues.messageId)
        }
        return true
      })
    } else {
      ress.forEach(async usuario => {
        logger.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'confirmacionInicial',
          email: usuario.email,
          nombre: user.nombre,
          solicitudId: solicitud.idSolicitud,
          usuario: {
            empresa: usuario.empresa,
            ranchos: solicitud.data.ranchoDestino
          },
          data: {
            folio: solicitud.data.folio,
            cantidad: solicitud.data.cantidad,
            presentacion: solicitud.data.presentacion,
            metodoAplicacion: solicitud.data.metodoAplicacion,
            descripcion: solicitud.data.descripcion
          }
        })
        // validamos los solicitudados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
          return false
        } else {
          logger.info('Correo enviado:', respues.messageId)
        }
        return true
      })
    }
  }

  #eliminarDuplicados = (array) => {
    const uniqueIds = new Set()
    return array.filter(item => {
      if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id)
        return true
      }
      return false
    })
  }

  #obtenerMezclasParaAdminMezclador = async (user, params, logContext) => {
    const { status, confirmacion, idUsuario } = params

    loggerWiston.debug('Obteniendo mezclas para admin mezclador', {
      ...logContext,
      empresa: user.empresa,
      ranchos: user.ranchos
    })

    if (user.empresa === 'General' && user.ranchos === 'General') {
      return await this.mezclaModel.obtenerMezclasMichoacan()
    }

    const [mezclasValidadas, mezclasPorUsuario] = await Promise.all([
      this.mezclaModel.obtenerTablaMezclasValidados({
        status,
        empresa: user.empresa,
        confirmacion,
        idUsuario
      }),
      this.mezclaModel.obtenerTablaMezclasUsuario({
        status,
        idUsuarioSolicita: idUsuario,
        confirmacion
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasValidadas || [],
      mezclasPorUsuario || []
    ])
  }

  #obtenerMezclasParaMichoacan = async (params, logContext) => {
    const { status, confirmacion, idUsuario } = params

    loggerWiston.debug('Obteniendo mezclas para Michoacán', logContext)

    const [mezclasValidadas, mezclasRancho] = await Promise.all([
      this.mezclaModel.obtenerTablaMezclasValidadosMichoacan({
        status,
        confirmacion,
        idUsuario
      }),
      this.mezclaModel.obtenerTablaMezclasRancho({
        status,
        ranchoDestino: 'Ahualulco',
        confirmacion,
        idUsuario
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasValidadas || [],
      mezclasRancho || []
    ])
  }

  #obtenerMezclasParaBioagricultura = async (params, logContext) => {
    const { status, confirmacion, idUsuario } = params

    loggerWiston.debug('Obteniendo mezclas para Bioagricultura', logContext)

    const [mezclasRancho, mezclasPorUsuario] = await Promise.all([
      this.mezclaModel.obtenerTablaMezclasRancho({
        status,
        ranchoDestino: 'Atemajac',
        confirmacion,
        idUsuario
      }),
      this.mezclaModel.obtenerTablaMezclasUsuario({
        status,
        idUsuarioSolicita: idUsuario,
        confirmacion
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasRancho || [],
      mezclasPorUsuario || []
    ])
  }

  #obtenerMezclasSegunRol = async (user, params, logContext, logger) => {
    const { status, confirmacion, idUsuario } = params

    switch (user.rol) {
      case 'mezclador':
        return await this.#obtenerMezclasParaMezclador(user, params, logContext, logger)

      case 'solicita':
        return await this.mezclaModel.obtenerTablaMezclasUsuario({
          status,
          idUsuarioSolicita: idUsuario,
          confirmacion
        })

      case 'solicita2':
        return await this.mezclaModel.obtenerTablaMezclasEmpresa({
          status,
          empresa: user.empresa,
          confirmacion,
          idUsuario
        })

      case 'supervisor':
        return await this.mezclaModel.getAll()

      case 'administrativo':
        return await this.#obtenerMezclasParaAdministrativo(user, params, logContext)

      case 'adminMezclador':
        return await this.#obtenerMezclasParaAdminMezclador(user, params, logContext, confirmacion)

      default:
        loggerWiston.warn('Rol no autorizado', { ...logContext, rol: user.rol })
        throw new ValidationError('Rol no autorizado')
    }
  }

  #obtenerMezclasParaAdministrativo = async (user, params, logContext) => {
    const { status, confirmacion, idUsuario } = params

    loggerWiston.debug('Obteniendo mezclas para administrativo', {
      ...logContext,
      empresa: user.empresa,
      ranchos: user.ranchos
    })

    if (user.empresa === 'General' && user.ranchos) {
      return await this.mezclaModel.getAllGeneral({
        status,
        confirmacion,
        idUsuario
      })
    }

    const [mezclasPorEmpresa, mezclasPorUsuario] = await Promise.all([
      this.mezclaModel.obtenerTablaMezclasEmpresa({
        status,
        empresa: user.empresa,
        confirmacion,
        idUsuario
      }),
      this.mezclaModel.obtenerTablaMezclasUsuario({
        status,
        idUsuarioSolicita: idUsuario,
        confirmacion
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasPorEmpresa || [],
      mezclasPorUsuario || []
    ])
  }

  #obtenerMezclasParaMezclador = async (user, params, logContext, logger) => {
    const { status, confirmacion, idUsuario } = params

    if (user.ranchos === 'General') {
      return await this.mezclaModel.obtenerTablaMezclasEmpresa({
        status,
        empresa: user.empresa,
        confirmacion,
        idUsuario,
        logContext,
        logger
      })
    }

    if (user.ranchos === 'Atemajac') {
      logger.debug('Obteniendo mezclas para Atemajac', logContext)

      const [mezclasRancho, mezclasEmpresa] = await Promise.all([
        this.mezclaModel.obtenerTablaMezclasRancho({
          status,
          ranchoDestino: user.ranchos,
          confirmacion,
          idUsuario,
          logContext,
          logger
        }),
        this.mezclaModel.obtenerTablaMezclasEmpresa({
          status,
          empresa: 'Lugar Agricola',
          confirmacion,
          idUsuario,
          logContext,
          logger
        })
      ])

      return this.#combinarYFiltrarResultados([
        mezclasRancho || [],
        mezclasEmpresa || []
      ])
    }

    return await this.mezclaModel.obtenerTablaMezclasRancho({
      status,
      ranchoDestino: user.ranchos,
      confirmacion,
      idUsuario,
      logContext,
      logger
    }) || []
  }

  #combinarYFiltrarResultados = (arrays) => {
    const resultados = arrays.flat()
    return resultados.length > 0 ? this.#eliminarDuplicados(resultados) : []
  }

  #validarDatosCreacion (data) {
    const errores = []

    if (data.tipo === 'Mezcla') {
      if (!data.cantidad) errores.push('La cantidad es requerida')
      if (!data.centroCoste) errores.push('El centro de coste es requerido')
      if (!data.empresaPertece) errores.push('La empresa es requerida')
      if (!data.folio) { if (!data.empresaPertece) errores.push('La empresa es requerida') }
      if (!data.metodoAplicacion) errores.push('El metodo de aplicación es requerido')
      if (!data.presentacion) errores.push('La presentación es requerida')
      if (!data.rancho) errores.push('El rancho es requerido')
      if (!data.temporada) errores.push('La temporada es requerida')
      if (!data.variedad) errores.push('La variedad es requerida')
      if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
    } else if (data.tipo === 'Fertilizantes') {
      if (!data.rancho) errores.push('El rancho es requerido')
      if (!data.empresaPertece) errores.push('La empresa es requerida')
      if (!data.centroCoste) errores.push('El centro de coste es requerido')
      if (!data.variedad) errores.push('La variedad es requerida')
      if (!data.temporada) errores.push('La temporada es requerida')
      if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
    } else if (data.tipo === 'Devoluciones') {
      if (!data.almacen) errores.push('El almacen es requerido')
      if (!data.temporada) errores.push('La temporada es requerida')
      if (!data.descripcion) errores.push('La descripción es requerida')
      if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
    }
    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }

  #validarDatosRegistro (data) {
    const errores = []

    if (!data.rancho) errores.push('El rancho es requerido')
    if (!data.empresaPertece) errores.push('La empresa es requerida')
    if (!data.centroCoste) errores.push('El centro de coste es requerido')
    if (!data.variedad) errores.push('La variedad es requerida')
    if (!data.metodoAplicacion) errores.push('El metodo de aplicación es requerido')
    if (!data.temporada) errores.push('La temporada es requerida')
    if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
    if (!data.imagen) errores.push('La imagen de mezcla entregada es requerida')
    if (!data.fechaSolicitud) errores.push('La fecha de solicitud es requerida')
    if (!data.fechaEntrega) errores.push('La fecha de entrega es requerida')

    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }

  #validarDatosActualizacionEstado (data) {
    const errores = []
    const estadosPermitidos = ['Pendiente', 'Proceso', 'Completado', 'Cancelado']

    if (!data.status) {
      errores.push('El estado es requerido')
    } else if (!estadosPermitidos.includes(data.status)) {
      errores.push('Estado no válido')
    }

    if (!data.observaciones && ['Cancelado', 'Completado'].includes(data.status)) {
      errores.push('Las observaciones son requeridas para este estado')
    }

    if (errores.length > 0) {
      throw new ValidationError('Datos inválidos para actualización', { details: errores })
    }
  }

  // Helper adicional para validar roles y permisos
  #validarRolYPermisos = (user, operacion) => {
    const rolesPermitidos = {
      GET_MEZCLAS: ['mezclador', 'solicita', 'solicita2', 'supervisor', 'administrativo', 'adminMezclador'],
      VALIDATE_MEZCLAS: ['adminMezclador', 'supervisor'],
      CONFIRM_MEZCLAS: ['adminMezclador'],
      CANCEL_MEZCLAS: ['adminMezclador', 'supervisor'],
      UPDATE_MEZCLAS: ['adminMezclador', 'supervisor', 'administrativo', 'mezclador']
    }

    if (!rolesPermitidos[operacion]?.includes(user.rol)) {
      throw new ValidationError(`No tienes permisos para ${operacion}`)
    }
  }

  // Función auxiliar para truncar base64
  truncateBase64 = (base64String, maxLength = 100) => {
    if (!base64String) return null
    const length = base64String.length
    if (length <= maxLength) return base64String
    return {
      preview: `${base64String.substring(0, maxLength)}...`,
      totalLength: length,
      type: base64String.substring(0, base64String.indexOf(';')),
      size: Math.round(length * 0.75 / 1024) + 'KB'
    }
  }

  // Helper para enriquecer el contexto de log
  #enriquecerLogContext = (baseContext, extras = {}) => {
    return {
      ...baseContext,
      timestamp: new Date().toISOString(),
      ...extras
    }
  }
}

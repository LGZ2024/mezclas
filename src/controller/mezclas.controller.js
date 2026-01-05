import { enviarCorreo } from '../config/smtp.js'
import { UsuarioModel } from '../models/usuario.models.js'
// utils
import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
import loggerWiston from '../utils/logger.js'
import { format } from 'date-fns'

export class MezclasController {
  constructor({ mezclaModel }) {
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

      // Proceso de notificaciones por correo
      // const notificationTargets = await this.#determinarDestinatariosNotificacion({
      //   rancho: req.body.rancho,
      //   empresa: req.body.empresaPertece,
      //   user,
      //   result
      // })

      // logger.info('Notificaciones enviadas', {
      //   ...logContext,
      //   ...notificationTargets
      // })

      // await this.#enviarCorreoNotificacion({
      //   ...notificationTargets,
      //   solicitud: result,
      //   user,
      //   requestData: req.body,
      //   logger,
      //   logContext
      // })

      // // Log de finalización
      // logger.info('Mezcla creada exitosamente', {
      //   ...logContext,
      //   solicitudId: result.idSolicitud,
      //   duration: Date.now() - new Date(logContext.timestamp).getTime()
      // })

      return res.json({
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

  // eliminar solicitud
  delete = asyncHandler(async (req, res) => {
    const { user } = req.session
    const id = req.params.id
    const logger = req.logger // Logger con correlación

    const logContext = {
      operation: 'ELIMINAR_SOLICITUD_MEZCLA',
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      solicitudId: id
    }
    try {
      logger.info('Eliminando solicitud', logContext)

      const result = await this.mezclaModel.delete({
        id,
        logContext,
        logger
      })

      console.log(result)
      logger.info('Solicitud eliminada exitosamente', logContext)

      return res.json({
        message: result.message,
        idSolicitud: result.idSolicitud
      })
    } catch (error) {
      console.log(error)
      logger.error('Error al eliminar solicitud', {
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
      id_solocitud: idSolicitud,
      requestBody: req.body
    }

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
  })

  cerrarSolicitid = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { idSolicitud } = req.params
    const logger = req.logger // Logger with correlation
    const archivo = req.file
    console.log(archivo)
    const logContext = {
      operation: 'Cerrar Solicitud',
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      idSolicitud
    }

    logger.info('Iniciando actualización de estado', logContext)

    const result = await this.mezclaModel.cerrarSolicitud({
      imagen: archivo,
      idSolicitud,
      idUsuario: user.id,
      logContext,
      logger
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
    console.log(status)
    let params = {}
    const logContext = {
      operation: 'GET_MEZCLAS_EMPRESA',
      userId: user.id,
      userRole: user.rol,
      name: user.nombre,
      status,
      empresa: user.empresa
    }

    logger.info('Iniciando obtención de mezclas', logContext)

    // Validación inicial
    if (!status) {
      logger.warn('Status no proporcionado', logContext)
      throw new ValidationError('El estado es requerido')
    }

    if (status === 'Validacion') {
      params = {
        status,
        validacion: false,
        idUsuario: user.id
      }
    } else {
      // Parámetros base
      params = {
        status,
        confirmacion: 'Confirmada',
        idUsuario: user.id
      }
    }

    console.log(params)
    // Obtener resultados según rol
    const result = await this.#obtenerMezclasSegunRol(user, params, logContext, logger)

    // Log de finalización
    logger.info('Consulta completada exitosamente', logContext)

    return res.json(result.data || result)
  })

  //
  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const { user } = req.session
    const id = req.params.id
    const logger = req.logger // Logger with correlation

    console.log('id', id)
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

    logger.info('GET_TABLAS_CONFIRMAR started', logContext)

    let result = []
    const confirmacion = 'Pendiente'
    const validacion = true

    if (user.rol === 'adminMezclador' && user.empresa === 'General') {
      console.log('GET_TABLAS_CONFIRMAR fetching_michoacan')
      logger.info('GET_TABLAS_CONFIRMAR', 'fetching_michoacan')

      const [res2, res1] = await Promise.all([
        this.mezclaModel.obtenerTablaMezclasValidadosMichoacan({
          status: 'Pendiente',
          confirmacion,
          validacion,
          idUsuario: user.id,
          logContext,
          logger
        }),
        this.mezclaModel.obtenerTablaMezclasRancho({
          status: 'Pendiente',
          ranchoDestino: 'Ahualulco',
          confirmacion,
          validacion,
          idUsuario: user.id,
          logContext,
          logger
        })
      ])

      if (Array.isArray(res2)) result = result.concat(res2)
      if (Array.isArray(res1)) result = result.concat(res1)
    } else if (user.rol === 'adminMezclador' && user.empresa === 'Bioagricultura') {
      console.log('GET_TABLAS_CONFIRMAR fetching_bioagricultura')
      logger.info('GET_TABLAS_CONFIRMAR fetching_bioagricultura', logContext)

      const [res2, res1] = await Promise.all([
        this.mezclaModel.obtenerTablaMezclasRancho({
          status: 'Pendiente',
          ranchoDestino: 'Atemajac',
          confirmacion,
          validacion,
          idUsuario: user.id,
          logContext,
          logger
        }),
        this.mezclaModel.obtenerTablaMezclasUsuario({
          status: 'Pendiente',
          idUsuarioSolicita: user.id,
          confirmacion,
          validacion,
          logContext,
          logger
        })
      ])

      if (Array.isArray(res2)) result = result.concat(res2)
      if (Array.isArray(res1)) result = result.concat(res1)
    } else if (user.rol === 'master') {
      console.log('GET_TABLAS_CONFIRMAR fetching_master')

      result = await this.mezclaModel.obtenerTablaMezclasAll({ status: 'Pendiente', confirmacion, validacion, rol: user.rol, logContext, logger })
    }
    const uniqueResults = this.#eliminarDuplicados(result)

    logger.info('GET_TABLAS_CONFIRMAR', 'completed', {
      resultCount: uniqueResults.length,
      duration: Date.now() - new Date(logContext.timestamp).getTime()
    })

    return res.json(uniqueResults)
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

    logger.info('CONFIRM_MEZCLA started', logContext)

    const response = await this.mezclaModel.mezclaConfirmar({
      idSolicitud,
      data: req.body,
      usuario: user,
      logContext,
      logger
    })

    logger.info('CONFIRM_MEZCLA completed', logContext)

    return res.json({
      success: true,
      message: response.message
    })
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
  })

  validacion = asyncHandler(async (req, res) => {
    console.log('entro a la validacion')
    const { user } = req.session
    const data = req.body
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'Confirmacion de mezcla',
      username: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: data
    }

    logger.info('VALIDATE_MEZCLA started', logContext)

    const result = await this.mezclaModel.validacion({
      data,
      idUsuario: user.id,
      user,
      logContext,
      logger
    })

    logger.info('VALIDATE_MEZCLA Finish')
    return res.json(result)
  })

  validaciones = asyncHandler(async (req, res) => {
    const { user } = req.session
    const data = req.body
    const logger = req.logger // Logger with correlation
    const { idSolicitud } = req.params

    const logContext = {
      operation: 'Validar solicitudes',
      username: user.nombre,
      userId: user.id,
      userRole: user.rol,
      solicitudId: idSolicitud,
      requestBody: data
    }

    logger.info('VALIDATE_MEZCLA started', logContext)

    const result = await this.mezclaModel.validaciones({
      idSolicitud,
      data,
      user,
      logContext,
      logger
    })

    // Proceso de notificaciones por correo
    const notificationTargets = await this.#determinarDestinatariosNotificacion({
      rancho: result.solicitud.ranchoDestino,
      empresa: result.solicitud.empresa,
      user,
      result
    })

    logger.info('Notificaciones enviadas', {
      ...logContext,
      ...notificationTargets
    })

    await this.#enviarCorreoNotificacion({
      ...notificationTargets,
      solicitud: idSolicitud,
      user,
      requestData: result.solicitud.dataValues,
      logger,
      logContext
    })

    logger.info('VALIDATE_MEZCLA Finish')
    return res.json(result)
  })

  cancelar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { idSolicitud } = req.params
    const data = req.body
    const logger = req.logger // Logger with correlation

    const logContext = {
      operation: 'CANCEL_MEZCLA',
      username: user.nombre,
      userId: user.id,
      solicitudId: idSolicitud,
      requestBody: data
    }

    logger.info('CANCEL_MEZCLA INICIADO', logContext)

    const result = await this.mezclaModel.cancelar({
      idSolicitud,
      data,
      idUsuario: user.id,
      logContext,
      logger,
      rol: user.rol
    })

    logger.info('CANCEL_MEZCLA COMPLETADO', { ...logContext })

    return res.json(result)
  })

  // funciones auxiliares y utilitarios
  #determinarDestinatariosNotificacion = async ({ rancho, empresa, user, result }) => {
    let ress = []
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
        r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
        ress = [...r3]
      } else if (rancho === 'La Loma' || rancho === 'Zapote' || rancho === 'Ojo de Agua') {
        const r1 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
        ress = [...r1]
      } else if (rancho === 'Ahualulco') {
        const r2 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
        ress = [...r2]
      } else {
        const r2 = await UsuarioModel.getOneId({ id: user.id }) // master
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
    console.log(requestData, solicitud)
    if (user.rol === 'adminMezclador') {
      ress.forEach(async usuario => {
        loggerWiston.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'solicitud',
          email: usuario.email,
          nombre: usuario.nombre,
          solicitudId: solicitud?.idSolicitud || solicitud.solicitud.id || solicitud,
          fechaSolicitud: format(requestData?.fechaSolicitud || requestData.solicitud?.fechaSolicitud || requestData.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss'),
          data: requestData,
          usuario: {
            nombre: user.nombre,
            empresa: user.empresa,
            ranchos: requestData.rancho || requestData?.ranchoDestino
          }
        })
        // validamos los solicitudados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
          return false
        } else {
          logger.info('Correo enviado')
        }
        return true
      })
    } else if ((requestData?.ranchoDestino || requestData.solicitud?.ranchoDestino) === 'Atemajac' || (requestData?.ranchoDestino || requestData?.ranchoDestino) === 'Seccion 7 Fresas') {
      // enviamos correo a los destinatarios para confirmacion para estos dos eanchos
      ress.forEach(async usuario => {
        logger.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'confirmacionInicial',
          email: usuario.email,
          nombre: user.nombre,
          solicitudId: solicitud.idSolicitud || solicitud.id || requestData.id,
          usuario: {
            empresa: usuario.empresa,
            ranchos: requestData?.ranchoDestino || requestData.solicitud?.ranchoDestino
          },
          data: {
            folio: requestData?.folio || requestData?.solicitud?.folio,
            cantidad: requestData?.cantidad || requestData?.solicitud?.cantidad,
            presentacion: requestData?.presentacion || requestData?.solicitud?.presentacion,
            metodoAplicacion: requestData?.metodoAplicacion || requestData?.solicitud?.metodoAplicacion,
            descripcion: requestData?.descripcion || requestData?.solicitud?.descripcion
          }
        })
        // validamos los solicitudados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
          return false
        } else {
          logger.info('Correo enviado')
        }
        return true
      })
    } else {
      console.log('enviando correo a los destinatarios', solicitud)
      ress.forEach(async usuario => {
        loggerWiston.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'solicitud',
          email: usuario.email,
          nombre: usuario.nombre,
          solicitudId: solicitud,
          fechaSolicitud: format(requestData?.fechaSolicitud || requestData?.solicitud?.fechaSolicitud || solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss'),
          data: requestData,
          usuario: {
            nombre: user.nombre,
            empresa: user.empresa,
            ranchos: requestData.rancho || requestData?.ranchoDestino || requestData?.solicitud?.ranchoDestino
          }
        })
        // validamos los solicitudados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
          return false
        } else {
          logger.info('Correo enviado')
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
        confirmacion,
        logContext,
        logger: loggerWiston
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
        confirmacion,
        logContext,
        logger: loggerWiston
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasRancho || [],
      mezclasPorUsuario || []
    ])
  }

  #obtenerMezclasSegunRol = async (user, params, logContext, logger) => {
    const { status, confirmacion, idUsuario } = params
    console.log(params)
    console.log(user)

    switch (user.rol) {
      case 'mezclador':
        console.log('obteniendo mezclas para mezclador')
        return await this.#obtenerMezclasParaMezclador(user, params, logContext, logger)

      case 'solicita':
        if (status === 'Validacion') {
          return await this.mezclaModel.obtenerTablaMezclasUsuario({
            status,
            idUsuarioSolicita: idUsuario,
            validacion: false,
            logContext,
            logger
          })
        } else {
          return await this.mezclaModel.obtenerTablaMezclasUsuario({
            status,
            idUsuarioSolicita: idUsuario,
            confirmacion,
            logContext,
            logger
          })
        }
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

      case 'master':
        return await this.mezclaModel.getAllGeneral({ status: params.status, confirmacion: params.confirmacion, logger, logContext })

      default:
        logger.warn('Rol no autorizado', { ...logContext, rol: user.rol })
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
        confirmacion,
        logContext,
        logger: loggerWiston
      })
    ])

    return this.#combinarYFiltrarResultados([
      mezclasPorEmpresa || [],
      mezclasPorUsuario || []
    ])
  }

  #obtenerMezclasParaMezclador = async (user, params, logContext, logger) => {
    const { status, confirmacion, idUsuario } = params
    console.log(user)
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
      console.log('obteniendo mezclas para Atemajac')
      const [mezclasRancho, mezclasEmpresa] = await Promise.all([
        this.mezclaModel.obtenerTablaMezclasRancho({
          status,
          ranchoDestino: user.ranchos,
          confirmacion,
          validacion: true,
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

  #validarDatosCreacion(data) {
    const errores = []

    if (data.tipo === 'Mezcla') {
      if (!data.cantidad || data.cantidad <= 0) errores.push('La cantidad es requerida y debe ser mayor a 0')
      if (!data.centroCoste) errores.push('El centro de coste es requerido')
      if (!data.empresaPertece) errores.push('La empresa es requerida')
      if (!data.folio) { if (!data.empresaPertece) errores.push('La empresa es requerida') }
      if (!data.metodoAplicacion) errores.push('El metodo de aplicación es requerido')
      if (!data.presentacion) errores.push('La presentación es requerida')
      if (!data.rancho) errores.push('El rancho es requerido')
      if (!data.temporada) errores.push('La temporada es requerida')
      if (!data.variedad) errores.push('La variedad es requerida')
      if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
      if (!data.fechaAplicacion) errores.push('La fecha de aplicación es requerida')
      if (!data.idTipoAplicacion) errores.push('El tipo de aplicación es requerido')
      if (!data.idAplicacion) errores.push('La aplicación es requerida')
    } else if (data.tipo === 'Fertilizantes') {
      if (!data.rancho) errores.push('El rancho es requerido')
      if (!data.empresaPertece) errores.push('La empresa es requerida')
      if (!data.centroCoste) errores.push('El centro de coste es requerido')
      if (!data.variedad) errores.push('La variedad es requerida')
      if (!data.temporada) errores.push('La temporada es requerida')
      if (data.productos.length === 0) errores.push('Debe seleccionar al menos un producto')
      if (!data.fechaAplicacion) errores.push('La fecha de aplicación es requerida')
      if (!data.idTipoAplicacion) errores.push('El tipo de aplicación es requerido')
      if (!data.idAplicacion) errores.push('La aplicación es requerida')
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

  #validarDatosRegistro(data) {
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

  #validarDatosActualizacionEstado(data) {
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
      GET_MEZCLAS: ['mezclador', 'solicita', 'solicita2', 'supervisor', 'administrativo', 'adminMezclador', 'master'],
      VALIDATE_MEZCLAS: ['adminMezclador', 'supervisor', 'master'],
      CONFIRM_MEZCLAS: ['adminMezclador', 'master'],
      CANCEL_MEZCLAS: ['adminMezclador', 'supervisor', 'master'],
      UPDATE_MEZCLAS: ['adminMezclador', 'supervisor', 'administrativo', 'mezclador', 'master']
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

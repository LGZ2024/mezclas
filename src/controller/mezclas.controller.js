import { enviarCorreo } from '../config/smtp.js'
import { UsuarioModel } from '../models/usuario.models.js'
import { format } from 'date-fns'
import { asyncHandler } from '../utils/asyncHandler.js'
import logger from '../utils/logger.js'
import { ValidationError } from '../utils/CustomError.js'
export class MezclasController {
  constructor ({ mezclaModel }) {
    this.mezclaModel = mezclaModel
  }

  // crear solicitudes
  create = asyncHandler(async (req, res) => {
    let ress
    // obtenemos los datos de la sesion
    const { user } = req.session

    // Acceder a los datos de FormData
    const result = await this.mezclaModel.create({ data: req.body, idUsuario: user.id })

    // procesar fecha
    const fechaSolicitud = new Date(result.fechaSolicitud)
    const fechaFormateada = format(fechaSolicitud, 'dd/MM/yyyy HH:mm:ss')

    // estos usuarios les llegaran todas las notificaciones
    const r2 = await UsuarioModel.getUserEmailEmpresa({ rol: 'administrativo', empresa: 'General' })

    // obtenemos los datos del usuario al que mandaremos el correo
    if (req.body.rancho === 'Atemajac' || req.body.rancho === 'Ahualulco') {
      const r1 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: req.body.empresaPertece, rancho: req.body.rancho })
      const r3 = await UsuarioModel.getUserEmailRancho({ rol: 'administrativo', empresa: 'Bioagricultura', rancho: 'General' })
      ress = [...r1, ...r2, ...r3]
    } else if (req.body.rancho === 'Seccion 7 Fresas') {
      const r1 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: 'Bioagricultura', rancho: 'Atemajac' })
      const r3 = await UsuarioModel.getUserEmailRancho({ rol: 'administrativo', empresa: 'Lugar Agricola', rancho: 'Seccion 7 Fresas' })
      ress = [...r1, ...r2, ...r3]
    } else {
      // obtenemos los datos del usuario al que mandaremos el correo
      const r1 = await UsuarioModel.getUserEmail({ rol: 'mezclador', empresa: req.body.empresaPertece })
      ress = [...r1, ...r2]
    }
    if (ress) {
      // Usar forEach para mapear los resultados
      ress.forEach(async usuario => {
        logger.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({ type: 'solicitud', email: usuario.email, nombre: usuario.nombre, solicitudId: result.idSolicitud, fechaSolicitud: fechaFormateada, data: req.body, usuario: user })
        // validamos los resultados
        if (respues.error) {
          logger.error('Error al enviar correo:', respues.error)
        } else {
          logger.info('Correo enviado:', respues.messageId)
        }
      })
    } else {
      logger.debug('No se encontraron usuarios')
    }
    return res.json({ message: result.message })
  })

  estadoProceso = asyncHandler(async (req, res) => {
    const result = await this.mezclaModel.estadoProceso({ id: req.params.idSolicitud, data: req.body })
    const ress = await UsuarioModel.getOneId({ id: result.idUsuarioSolicita })
    logger.info(`nombre:${ress.nombre}, correo:${ress.email}`)
    await enviarCorreo({
      type: 'status',
      email: ress.email,
      nombre: ress.nombre,
      solicitudId: req.params.idSolicitud,
      status: req.body.status
    })
    return res.json({ message: result.message })
  })

  notificacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud
    const { mensajes, idMesclador } = req.body

    const result = await this.mezclaModel.mensajeSolicita({ id: idSolicitud, mensajes, idUsuario: idMesclador })

    const mezclador = await UsuarioModel.getOneId({ id: idMesclador })

    logger.info(`nombre:${mezclador.nombre}, correo:${mezclador.email}`)

    await enviarCorreo({
      type: 'respuestaSolicitante',
      email: mezclador.email,
      nombre: user.nombre,
      solicitudId: idSolicitud,
      usuario: {
        empresa: user.empresa,
        ranchos: user.ranchos
      },
      data: {
        mensaje: mensajes
      }
    })

    return res.json({ message: result.message })
  })

  cerrarSolicitid = asyncHandler(async (req, res) => {
    const { user } = req.session
    // Acceder a los datos de FormData
    const result = await this.mezclaModel.cerrarSolicitid({ data: req.body, idUsuario: user.id })
    const ress = await UsuarioModel.getOneId({ id: result.idUsuarioSolicita })
    logger.info(`nombre:${ress.nombre}, correo:${ress.email}`)
    await enviarCorreo({
      type: 'status',
      email: ress.email,
      nombre: ress.nombre,
      solicitudId: result.id,
      status: result.status,
      usuario: user,
      data: {
        rancho: result.rancho || req.body.rancho, // Usar el rancho del resultado o del body
        descripcion: result.descripcion || req.body.descripcion,
        folio: result.folio || req.body.folio
      }
    })
    return res.json({ message: result.message })
  })

  obtenerTablaMezclasEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    logger.info('Obteniendo datos  del usuario: ', user)
    // console.log('user', user)
    const { status } = req.params

    if (!status) {
      throw new ValidationError('El estado es requerido')
    }

    let result = []

    switch (user.rol) {
      case 'mezclador':
        if (user.ranchos === 'General') {
          result = await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa })
        } else if (user.ranchos === 'Atemajac') {
          const r1 = await this.mezclaModel.obtenerTablaMezclasRancho({
            status,
            ranchoDestino: user.ranchos
          }) || []
          const r2 = await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: 'Lugar Agricola'
          }) || []

          result = [
            ...(Array.isArray(r1) ? r1 : []),
            ...(Array.isArray(r2) ? r2 : [])
          ]

          // Validar si hay resultados
          if (result.length === 0) {
            result = [] // Asegurar que retornamos un array vacío
          }
        } else {
          result = await this.mezclaModel.obtenerTablaMezclasRancho({ status, ranchoDestino: user.ranchos })
        }
        break
      case 'solicita':
        result = await this.mezclaModel.obtenerTablaMezclasUsuario({ status, idUsuarioSolicita: user.id })
        break
      case 'solicita2':
        result = await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa })
        break
      case 'supervisor':
        result = await this.mezclaModel.getAll()
        break
      case 'administrativo': {
        if (user.empresa === 'General' && user.ranchos) {
          result = await this.mezclaModel.getAllGeneral({ status })
        } else {
          const [res2, res1] = await Promise.all([
            this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa }),
            this.mezclaModel.obtenerTablaMezclasUsuario({ status, idUsuarioSolicita: user.id })
          ])
          // Verificar y combinar resultados
          if (Array.isArray(res2)) {
            result = result.concat(res2) // Agregar res2 si es un array
          }
          if (Array.isArray(res1)) {
            result = result.concat(res1) // Agregar res1 si es un array
          }
          // Eliminar duplicados basados en un campo único, por ejemplo, 'id'
          const uniqueIds = new Set()
          const uniqueResults = result.filter(item => {
            if (!uniqueIds.has(item.id)) { // Cambia 'id' por el campo que identifique de manera única
              uniqueIds.add(item.id)
              return true
            }
            return false
          })

          // Asignar los resultados únicos a result
          result = uniqueResults
        }

        break
      }
      default:
        return res.status(403).json({ error: 'Rol no autorizado' })
    }

    return res.json(result.data || result)
  })

  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await this.mezclaModel.obtenerTablaMezclasId({ id })
    return res.json(result.data)
  })
}

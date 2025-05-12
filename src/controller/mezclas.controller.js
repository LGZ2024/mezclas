import { enviarCorreo } from '../config/smtp.js'
import { UsuarioModel } from '../models/usuario.models.js'
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
    logger.info('Resultado de la creación:', result)
    // procesar fecha

    // obtenemos los datos del usuario al que mandaremos el correo
    if (req.body.rancho === 'Atemajac' || req.body.rancho === 'Ahualulco') {
      const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' }) // idUsuario: 33 es el id de Francisco Alvarez
      ress = [...r3]
    } else if (req.body.rancho === 'Seccion 7 Fresas') {
      const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' }) // idUsuario: 33 es el id de Francisco Alvarez
      ress = [...r3]
    } else if (req.body.rancho === 'Romero' || req.body.rancho === 'Potrero' || req.body.rancho === 'Casas de Altos') {
      let r3 = []
      if (user.rol === 'adminMezclador' && user.id === 33) {
        r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' }) // idUsuario: 33 es el id de Francisco Alvarez
      } else {
        r3 = await UsuarioModel.getUserEmailGerente({ rol: 'adminMezclador', idUsuario: 51 }) // idUsuario: 48 es el id de abigail ortiz
      }
      ress = [...r3]
    } else if (req.body.rancho === 'La Loma' || req.body.rancho === 'Zapote' || req.body.rancho === 'Ojo de Agua') {
      const r1 = await UsuarioModel.getUserEmailGerente({ rol: 'adminMezclador', idUsuario: 51 }) // idUsuario: 48 es el id de abigail ortiz
      ress = [...r1]
    }

    // validasmo resultados
    if (ress) {
      // Usar forEach para mapear los resultados
      ress.forEach(async usuario => {
        logger.info(`nombre:${usuario.nombre}, correo:${usuario.email}`)
        const respues = await enviarCorreo({
          type: 'confirmacionInicial',
          email: usuario.email,
          nombre: user.nombre,
          solicitudId: result.idSolicitud,
          usuario: {
            empresa: usuario.empresa,
            ranchos: result.data.ranchoDestino
          },
          data: {
            folio: result.data.folio,
            cantidad: result.data.cantidad,
            presentacion: result.data.presentacion,
            metodoAplicacion: result.data.metodoAplicacion,
            descripcion: result.data.descripcion
          }
        })
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
    const { status } = req.params
    let result = []
    const confirmacion = 'Confirmada'

    if (!status) {
      throw new ValidationError('El estado es requerido')
    }

    switch (user.rol) {
      case 'mezclador':
        if (user.ranchos === 'General') {
          result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: user.empresa,
            confirmacion
          })
        } else if (user.ranchos === 'Atemajac') {
          const r1 = await this.mezclaModel.obtenerTablaMezclasRancho({
            status,
            ranchoDestino: user.ranchos,
            confirmacion
          }) || []
          const r2 = await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: 'Lugar Agricola',
            confirmacion
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
          result = await this.mezclaModel.obtenerTablaMezclasRancho({
            status,
            ranchoDestino: user.ranchos,
            confirmacion
          }) || []
        }
        break
      case 'solicita':
        result = await this.mezclaModel.obtenerTablaMezclasUsuario({
          status,
          idUsuarioSolicita: user.id,
          confirmacion
        })
        break
      case 'solicita2':
        result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
          status,
          empresa: user.empresa,
          confirmacion
        })
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
      case 'adminMezclador':{
        if (user.empresa === 'General' && user.ranchos === 'General') {
          result = await this.mezclaModel.obtenerMezclasMichoacan({ status })
        } else {
          const [res2, res1] = await Promise.all([
            this.mezclaModel.obtenerTablaMezclasValidados({ status, empresa: user.empresa, confirmacion }),
            this.mezclaModel.obtenerTablaMezclasUsuario({ status, idUsuarioSolicita: user.id, confirmacion })
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

  obtenerTablasConfirmar = asyncHandler(async (req, res) => {
    const { user } = req.session
    let result = []
    let uniqueResults = []
    const confirmacion = 'Pendiente'
    logger.debug('obtenerTablasConfirmar', user)
    if (user.rol === 'adminMezclador' && user.empresa === 'General') {
      const res = await this.mezclaModel.obtenerTablaMezclasValidadosMichoacan({ status: 'Pendiente', confirmacion })
      // logger.debug('obtenerTablasConfirmar: res', res)
      if (Array.isArray(res)) {
        result = result.concat(res)
        logger.debug('obtenerTablasConfirmar: resultados', result)
      }
    } else if (user.rol === 'adminMezclador' && user.empresa === 'Bioagricultura') {
      if (user.ranchos !== 'General') {
        // Verificar si hay al menos una solicitud seleccionada
        const [res2, res1] = await Promise.all([
          this.mezclaModel.obtenerTablaMezclasValidados({ status: 'Pendiente', empresa: user.empresa, confirmacion }),
          this.mezclaModel.obtenerTablaMezclasUsuario({ status: 'Pendiente', idUsuarioSolicita: user.id, confirmacion })
        ])
        // Verificar y combinar resultados
        if (Array.isArray(res2)) {
          result = result.concat(res2) // Agregar res2 si es un array
        }
        if (Array.isArray(res1)) {
          result = result.concat(res1) // Agregar res1 si es un array
        }
      } else {
        const res = await this.mezclaModel.obtenerTablaMezclasJalisco({ status: 'Pendiente', empresa: user.empresa, confirmacion })
        // Verificar y combinar resultados
        if (Array.isArray(res)) {
          result = result.concat(res) // Agregar res1 si es un array
        }
      }
    }
    // Eliminar duplicados basados en un campo único, por ejemplo, 'id'
    const uniqueIds = new Set()
    uniqueResults = result.filter(item => {
      if (!uniqueIds.has(item.id)) { // Cambia 'id' por el campo que identifique de manera única
        uniqueIds.add(item.id)
        return true
      }
      return false
    })

    logger.debug('obtenerTablasConfirmar: uniqueResults', uniqueResults)
    // Asignar los resultados únicos a result
    result = uniqueResults
    return res.json(result)
  })

  mezclaConfirmar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud

    const response = await this.mezclaModel.mezclaConfirmar({ idSolicitud, data: req.body, usuario: user })
    logger.debug('mezclaConfirmar: response', response)
    return res.json({ message: response.message })
  })

  obtenerTablasCancelada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const confirmacion = 'Cancelada'
    const resultado = await this.mezclaModel.obtenerTablaMezclasCancelada({ confirmacion, idUsuario: user.id, rol: user.rol })
    logger.debug('obtenerTablasCancelada: resultado', resultado)
    return res.json(resultado)
  })

  validacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const data = req.body
    logger.debug('validacion: data', data)
    const result = await this.mezclaModel.validacion({ data, idUsuario: user.id, user })
    return res.json(result)
  })

  cancelar = asyncHandler(async (req, res) => {
    const { user } = req.session
    const idSolicitud = req.params.idSolicitud
    const data = req.body
    const result = await this.mezclaModel.cancelar({ idSolicitud, data, idUsuario: user.id })
    return res.json(result)
  })
}

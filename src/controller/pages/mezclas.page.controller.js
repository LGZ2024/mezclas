import { SolicitudRecetaModel } from '../../models/productosSolicitud.models.js'
import { MezclaModel } from '../../models/mezclas.models.js'
import { UsuarioModel } from '../../models/usuario.models.js'
import { NotificacionModel } from '../../models/notificaciones.models.js'
import { CatalogoModel } from '../../models/catalogo_corporativo.models.js'
import logger from '../../utils/logger.js'

export class MezclasPageController {
  solicitud = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // usuario

    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')
    const almacenes = [] // Cambiado de almacen a almacenes para mayor claridad

    // validadmos los ranchos, para saber el almacen al que pertenece
    const almacenAtemajac = ['Atemajac', 'Seccion 7 Fresas']
    const almacenAhualulco = ['Ahualulco']
    const almacenCasasAltos = ['Casas de Altos', 'Romero', 'Potrero']
    const almacenOjoDeAgua = ['Ojo de Agua', 'La Loma', 'Zapote']
    ranchos.forEach(rancho => {
      if (almacenAtemajac.includes(rancho)) {
        almacenes.push('Almacen Atemajac (Bioagricultura)')
      } else if (almacenAhualulco.includes(rancho)) {
        almacenes.push('Almacen Ahualulco (Bioagricultura)')
      } else if (almacenCasasAltos.includes(rancho)) {
        almacenes.push('Almacen Casas Altos (Moras Finas)')
      } else if (almacenOjoDeAgua.includes(rancho)) {
        almacenes.push('Almacen Ojo de Agua (Bayas del Centro)')
      }
    })
    // eliminamos los duplicados
    const uniqueAlmacenes = [...new Set(almacenes)]

    // obtencion de presentaciones
    const dataPresentacion = await CatalogoModel.obtenerPresentaciones()
    const presentacion = Array.isArray(dataPresentacion) ? dataPresentacion.map(p => p.dataValues || p) : []
    console.log('Presentaciones obtenidas:', presentacion)
    // temporada actual
    const dataTemporada = await CatalogoModel.obtenerTemporadas()
    const temporada = Array.isArray(dataTemporada) ? dataTemporada.map(t => t.dataValues || t) : []
    console.log('Temporadas obtenidas:', temporada)
    // metodo de tipo de aplicacion
    const dataTipoAplicacion = await CatalogoModel.obtenerTipoAplicaciones()
    const tipoAplicaciones = Array.isArray(dataTipoAplicacion) ? dataTipoAplicacion.map(t => t.dataValues || t) : []
    console.log('Tipo de aplicaciones obtenidas:', tipoAplicaciones)
    // metodo de tipo de aplicacion
    const dataMetodoAplicacion = await CatalogoModel.obtenerMetodoAplicaciones()
    const metodo = Array.isArray(dataMetodoAplicacion) ? dataMetodoAplicacion.map(m => m.dataValues || m) : []
    console.log('Metodo de aplicaciones obtenidas:', metodo)
    res.render('pages/mezclas/solicitud', { ranchos, almacen: uniqueAlmacenes || [], presentacion, temporada, tipoAplicaciones, metodo, nombre: user.nombre, rol: user.rol })
  }

  solicitudes = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/mezclas/pendientes', { rol: user.rol, nombre: user.nombre })
  }

  validacion = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/mezclas/validacion', { rol: user.rol, nombre: user.nombre })
  }

  proceso = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/mezclas/proceso', { rol: user.rol, nombre: user.nombre })
  }

  completadas = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/mezclas/completadas', { rol: user.rol, nombre: user.nombre })
  }

  notificacion = async (req, res) => {
    const { user } = req.session
    const { idSolicitud } = req.params
    let result

    // verificamos si existe un usuario
    if (!user) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: 'Acceso no utorizado'
      })
    }

    try {
      // validamos el rol de usuario
      switch (user.rol) {
        case 'mezclador': {
          result = await MezclaModel.getOneMesclador({
            id: idSolicitud,
            idSolicita: user.id
          })

          if (result.error) {
            throw new Error(result.error)
          }

          return res.render('pages/mezclas/notificacionesMesclador', {
            rol: user.rol,
            idSolicitud,
            data: result.data
          })
        }
        case 'solicita': {
          result = await MezclaModel.getOneSolicita({
            id: idSolicitud,
            idSolicita: user.id
          })

          if (result.error) {
            throw new Error(result.error)
          }

          // si existe alguna solicitud con el mismo usuario pasamos a obtener los productos
          const productos = await SolicitudRecetaModel.obtenerProductoNoDisponibles({ idSolicitud })

          // obtenemos los datos del mezclador que proceso la solicitud
          const mezclador = await UsuarioModel.getOneId({
            id: result.dataValues.idUsuarioMezcla
          })

          // obtenemos datos de la notificacion
          const notificacion = await NotificacionModel.getOneIDSolicitudUsuario({
            idUsuario: user.id, idSolicitud
          })

          logger.debug('Notificación obtenida:', notificacion[0].dataValues)

          return res.render('pages/mezclas/notificaciones', {
            nombre: user.nombre,
            idSolicitud,
            titulo: 'Cambio productos',
            productos,
            nombreMezclador: mezclador.nombre,
            idMezclador: result.dataValues.idUsuarioMezcla,
            empresa: mezclador.empresa,
            respuestaMezclador: result.dataValues.respuestaMezclador,
            idNotificacion: notificacion[0].dataValues.id
          })
        }
        case 'adminMezclador': {
          // validamos que el usuario sea fransico ya que es el que procesa la solicitud siendo administrativo
          if (user.nombre.trim() !== 'Francisco Alvarez') {
            throw new Error(result.error)
          }
          result = await MezclaModel.getOneSolicita({
            id: idSolicitud,
            idSolicita: user.id
          })

          if (result.error) {
            throw new Error(result.error)
          }
          // si existe alguna solicitud con el mismo usuario pasamos a obtener los productos
          const productos = await SolicitudRecetaModel.obtenerProductoNoDisponibles({ idSolicitud })

          // obtenemos los datos del mezclador que proceso la solicitud
          const mezclador = await UsuarioModel.getOneId({
            id: result.dataValues.idUsuarioMezcla
          })

          // obtenemos datos de la notificacion
          const notificacion = await NotificacionModel.getOneIDSolicitudUsuario({
            idUsuario: user.id,
            idSolicitud
          })

          logger.debug(notificacion)

          return res.render('pages/mezclas/notificaciones', {
            nombre: user.nombre,
            idSolicitud,
            titulo: 'Cambio productos',
            productos,
            nombreMezclador: mezclador.nombre,
            idMezclador: result.dataValues.idUsuarioMezcla,
            empresa: mezclador.empresa,
            respuestaMezclador: result.dataValues.respuestaMezclador,
            idNotificacion: notificacion[0].dataValues.id
          })
        }
        default:
          return res.status(403).render('errorPage', {
            title: '403 - Sin Autorisacion',
            codeError: '403',
            errorMsg: 'Acceso no utorizado'
          })
      }
    } catch (error) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: error.message
      })
    }
  }

  confirmacion = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: 'Acceso no utorizado'
      })
    }

    try {
      res.render('pages/mezclas/confirmaSolicitud', { rol: user.rol, user, nombre: user.nombre })
    } catch (error) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: error.message
      })
    }
  }

  canceladas = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: 'Acceso no utorizado'
      })
    }
    try {
      if (user.rol === 'master' || user.rol === 'administrativo' || user.rol === 'adminMezclador') {
        return res.render('pages/admin/solicitudesCanceladas', {
          user,
          rol: user.rol,
          titulo: 'Bienvenido'
        })
      } else if (user.rol === 'solicita' || user.rol === 'solicita2') {
        return res.render('pages/mezclas/canceladas', {
          rol: user.rol,
          nombre: user.nombre
        })
      } else {
        return res.status(403).render('errorPage', {
          title: '403 - Sin Autorisacion',
          codeError: '403',
          errorMsg: 'Acceso no utorizado'
        })
      }
    } catch (error) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: error.message
      })
    }
  }

  RegitrarSolicitud = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')

    res.render('pages/mezclas/registrarSolicitud', { ranchos, rol: user.rol })
  }
}

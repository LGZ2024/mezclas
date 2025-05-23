import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { MezclaModel } from '../models/mezclas.models.js'
import { UsuarioModel } from '../models/usuario.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import logger from '../utils/logger.js'

export class ProtetedController {
  // ruta Protegida
  protected = async (req, res) => {
    const { user } = req.session
    logger.debug('Usuario en la ruta protegida:', user)
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // validamos al usuario
    if (user.rol === 'admin' || user.rol === 'administrativo' || user.rol === 'adminMezclador') {
      res.status(200).render('pages/admin/solicitudes', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else if (user.rol === 'mezclador' || user.rol === 'solicita' || user.rol === 'supervisor' || user.rol === 'solicita2') {
      res.status(200).render('pages/mezclas/main', { rol: user.rol, nombre: user.nombre })
    }
  }

  // ruta vivienda
  solicitud = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')

    res.render('pages/mezclas/solicitud', { ranchos })
  }

  solicitudes = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/mezclas/pendientes', { rol: user.rol })
  }

  proceso = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/mezclas/proceso', { rol: user.rol })
  }

  completadas = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/mezclas/completadas', { rol: user.rol })
  }

  tablaSolicitudes = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/admin/solicitudes', { user, titulo: 'hola' })
  }

  usuarios = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/admin/usuarios', { user, titulo: 'hola' })
  }

  productos = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/admin/productos', { user, titulo: 'hola' })
  }

  centroCoste = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    res.render('pages/admin/centrosCoste', { user, titulo: 'hola' })
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
      res.render('pages/mezclas/confirmaSolicitud', { rol: user.rol, user })
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
      if (user.rol === 'admin' || user.rol === 'administrativo' || user.rol === 'adminMezclador') {
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

  // cerras sesion
  logout = async (req, res) => {
    try {
      res.clearCookie('access_token')
      return res.redirect('/') // Asegúrate de usar return aquí
    } catch (error) {
      console.error('Logout error:', error)
      return res.status(500).json({ error: 'Internal Server Error' }) // Asegúrate de usar return aquí
    }
  }
}

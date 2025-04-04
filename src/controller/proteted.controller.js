import { ProductosModel } from '../models/productos.models.js'
import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { MezclaModel } from '../models/mezclas.models.js'
import { UsuarioModel } from '../models/usuario.models.js'
export class ProtetedController {
  // ruta Protegida
  protected = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // validamos al usuario
    if (user.rol === 'admin' || user.rol === 'administrativo') {
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

    const productos = await ProductosModel.getAll()
    res.render('pages/mezclas/completadas', { productos })
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
          // obtenemos los datos de la solicitud
          console.log(result)
          // si existe alguna solicitud con el mismo usuario pasamos a obtener los productos
          const productos = await SolicitudRecetaModel.obtenerProductoNoDisponibles({ idSolicitud })

          // obtenemos los datos del mezclador que proceso la solicitud
          const mezclador = await UsuarioModel.getOneId({
            id: result.dataValues.idUsuarioMezcla
          })

          return res.render('pages/mezclas/notificaciones', {
            nombre: user.nombre,
            idSolicitud,
            titulo: 'Cambio productos',
            productos,
            nombreMezclador: mezclador.nombre,
            idMezclador: result.dataValues.idUsuarioMezcla,
            empresa: mezclador.empresa,
            respuestaMezclador: result.dataValues.respuestaMezclador
          })
        }
        case 'administrativo': {
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

          return res.render('pages/mezclas/notificaciones', {
            nombre: user.nombre,
            idSolicitud,
            titulo: 'Cambio productos',
            productos,
            nombreMezclador: mezclador.nombre,
            idMezclador: result.dataValues.idUsuarioMezcla,
            empresa: mezclador.empresa,
            respuestaMezclador: result.dataValues.respuestaMezclador
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

import logger from '../../utils/logger.js'

export class AdminPageController {
  // ruta Protegida
  protected = async (req, res) => {
    const { user } = req.session
    logger.debug('Usuario en la ruta protegida:', user)
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // validamos al usuario
    if (user.rol === 'administrativo' || user.rol === 'adminMezclador' || user.rol === 'master') {
      res.status(200).render('pages/admin/solicitudes', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else if (user.rol === 'mezclador' || user.rol === 'solicita' || user.rol === 'supervisor' || user.rol === 'solicita2') {
      res.status(200).render('pages/mezclas/main', { rol: user.rol, nombre: user.nombre })
    } else if (user.rol === 'encargado_combustible') {
      res.status(200).render('pages/combustibles/main', { rol: user.rol, nombre: user.nombre })
    } else if (user.rol === 'Activos Fijos') {
      res.status(200).render('pages/activos/main', { user, rol: user.rol, titulo: 'Bienvenido' })
    }
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

  empresas = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/catalogo/empresas', { rol: user.rol, nombre: user.nombre, user })
  }

  departamentos = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/catalogo/departamentos', { rol: user.rol, nombre: user.nombre, user })
  }

  ranchos = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/catalogo/ranchos', { rol: user.rol, nombre: user.nombre, user })
  }
}

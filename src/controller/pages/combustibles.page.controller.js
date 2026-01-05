export class CombustiblesPageController {
  talleres = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/talleres', { rol: user.rol, nombre: user.nombre })
  }

  registrarTalleres = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/agregarTalleres', { rol: user.rol, nombre: user.nombre })
  }

  tickets = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/tickets', { rol: user.rol, nombre: user.nombre })
  }

  ticketsCerrados = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/ticketsCerrados', { rol: user.rol, nombre: user.nombre })
  }

  preventivo = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/preventivos', { rol: user.rol, nombre: user.nombre })
  }

  correctivo = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/correctivos', { rol: user.rol, nombre: user.nombre })
  }

  servicios = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/servicios', { rol: user.rol, nombre: user.nombre })
  }

  agregarServicio = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/agregarServicio', { rol: user.rol, nombre: user.nombre })
  }

  registrarTicket = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/abrirTicket', { rol: user.rol, nombre: user.nombre })
  }

  cerrarTicket = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/cerrarTicket', { rol: user.rol, nombre: user.nombre })
  }

  mantenimientos = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/mantenimientos', { rol: user.rol, nombre: user.nombre })
  }

  unidades = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/unidades', { rol: user.rol, nombre: user.nombre })
  }

  registrarUnidades = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    res.render('pages/combustibles/agregarUnidad', { rol: user.rol, nombre: user.nombre })
  }

  agregarInventario = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')

    res.render('pages/combustibles/agregarInventario', { user, ranchos, rol: user.rol })
  }

  agregarSalidaInventario = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')

    res.render('pages/combustibles/agregarSalida', { user, ranchos, rol: user.rol })
  }

  agregarCargaCombustible = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',')

    res.render('pages/combustibles/agregarCombustible', { user, ranchos, rol: user.rol })
  }

  entradasCombustible = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    if (user.rol === 'master' || user.rol === 'administrativo' || user.rol === 'encargado_combustible') {
      res.render('pages/combustibles/tablaEntrada', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else {
      res.render('pages/combustibles/entradaInventario', { user, rol: user.rol })
    }
  }

  salidasCombustible = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    if (user.rol === 'master' || user.rol === 'administrativo' || user.rol === 'encargado_combustible') {
      res.render('pages/combustibles/tablaSalida', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else {
      res.render('pages/combustibles/salidaInventario', { user, rol: user.rol })
    }
  }

  cargasCombustible = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    if (user.rol === 'master' || user.rol === 'administrativo' || user.rol === 'encargado_combustible') {
      res.render('pages/combustibles/tablaCarga', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else {
      res.render('pages/combustibles/cargasCombustible', { user, rol: user.rol })
    }
  }

  inventario = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    if (user.rol === 'master' || user.rol === 'administrativo' || user.rol === 'encargado_combustible') {
      res.render('pages/combustibles/tablaInventario', { user, rol: user.rol, titulo: 'Bienvenido' })
    } else {
      res.render('pages/combustibles/inventario', { user, rol: user.rol })
    }
  }

  combustibles = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array /combustibles/navCombustibles
    res.status(200).render('pages/combustibles/main', { rol: user.rol, nombre: user.nombre, user })
  }
}

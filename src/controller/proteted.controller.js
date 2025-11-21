import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { MezclaModel } from '../models/mezclas.models.js'
import { UsuarioModel } from '../models/usuario.models.js'
import { SalidaCombustibleModel } from '../models/combustible_salida.models.js'
import { EntradaCombustibleModel } from '../models/combustible_entrada.models.js'
import { CargaCombustibleModel } from '../models/combustible_carga.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import { ProduccionModel } from '../models/produccion.models.js'
import { CatalogoModel } from '../models/catalogo_corporativo.models.js'
import logger from '../utils/logger.js'

export class ProtetedController {
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

  activosFijos = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // validamos al usuario
    res.status(200).render('pages/activos/main', { user, rol: user.rol, titulo: 'Bienvenido' })
  }

  activosDashboard = async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      userName: user.name,
      userId: user.id,
      userRol: user.rol
    }
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })

    // Obtener datos de activos fijos
    const rawData = await ProduccionModel.ObtenerActivosFijos({ logger, logContext })
    const data = Array.isArray(rawData) ? rawData : []
    res.render('pages/activos/graficas', { user, rol: user.rol, titulo: 'Bienvenido', data, tipo: 'activos' })
  }

  // ruta vivienda
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

  asignaciones = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ubicaciones = ['Atemajac', 'Ahualulco', 'Casas de Altos', 'Ojo de Agua', 'Potrero', 'Romero', 'Seccion 7 Fresas', 'La Loma', 'Zapote', 'Oficina 1', 'Oficina 2']
    const departamentos = ['Administracion', 'Cuentas Por Pagar', 'Cuentas Por Cobrar', 'Recursos Humanos', 'Sistemas', 'Activos Fijos', 'Produccion', 'Finanzas', 'Banca Movil', 'IMMS', 'Nominas', 'Prenomina', 'Timbrado', 'Contabilidad', 'Juridico', 'Tesoreria', 'Nomina Administrativa', 'Gerencia', 'Almacen']
    res.render('pages/activos/asignarEquipos', { user, rol: user.rol, titulo: 'Bienvenido', ubicaciones, departamentos })
  }

  asignacioness = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    res.render('pages/activos/graficas', { user, rol: user.rol, titulo: 'Bienvenido' })
  }

  bajas = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    res.render('pages/activos/baja', { user, rol: user.rol, titulo: 'Bienvenido' })
  }

  historialA = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    res.render('pages/activos/historal', { user, rol: user.rol, titulo: 'Bienvenido' })
  }

  historialE = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    res.render('pages/activos/historialEquipos', { user, rol: user.rol, titulo: 'Bienvenido' })
  }

  empleados = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const departamentos = ['Administracion', 'Cuentas Por Pagar', 'Cuentas Por Cobrar', 'Recursos Humanos', 'Sistemas', 'Activos Fijos', 'Produccion', 'Finanzas', 'Banca Movil', 'IMMS', 'Nominas', 'Prenomina', 'Timbrado', 'Contabilidad', 'Juridico', 'Tesoreria', 'Nomina Administrativa', 'Gerencia', 'Almacen']

    res.render('pages/activos/empleados', { user, rol: user.rol, titulo: 'Bienvenido', departamentos })
  }

  combustibles = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array /combustibles/navCombustibles
    res.status(200).render('pages/combustibles/main', { rol: user.rol, nombre: user.nombre, user })
  }

  graficas = async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { tipo } = req.params
    const logContext = {
      userName: user.name,
      userId: user.id,
      userRol: user.rol
    }
    let rawData
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    if (tipo === 'salidas') {
      rawData = await SalidaCombustibleModel.SalidaCombustible({ logger, logContext })
    } else if (tipo === 'entradas') {
      rawData = await EntradaCombustibleModel.obtenerEntradasCombustibles({ logger, logContext })
    } else if (tipo === 'cargas') {
      rawData = await CargaCombustibleModel.obtenerCargasCombustibles({ logger, logContext })
    } else if (tipo === 'solicitudes') {
      rawData = await ProduccionModel.ObtenerSolicitudes({ logger, logContext })
    } else if (tipo === 'activos') {
      rawData = await ProduccionModel.ObtenerActivosFijosGraficas({ logger, logContext })
    } else {
      return res.status(400).render('errorPage', { codeError: '400', errorMsg: 'Tipo de gráfica no válido' })
    }
    const data = Array.isArray(rawData) ? rawData : []
    res.render('pages/activos/graficas', { user, rol: user.rol, titulo: 'Bienvenido', data, tipo })
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

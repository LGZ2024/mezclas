import { ProduccionModel } from '../../models/produccion.models.js'

export class ActivosPageController {
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

  asignaciones = async (req, res) => {
    const { user } = req.session
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', { codeError: '403', errorMsg: 'Acceso no utorizado' })
    // Separar los ranchos en un array
    const ubicaciones = ['Atemajac', 'Ahualulco', 'Casas de Altos', 'Ojo de Agua', 'Potrero', 'Romero', 'Seccion 7 Fresas', 'La Loma', 'Zapote', 'Oficina 1', 'Oficina 2']
    const departamentos = ['Administracion', 'Cuentas Por Pagar', 'Cuentas Por Cobrar', 'Recursos Humanos', 'Sistemas', 'Activos Fijos', 'Produccion', 'Finanzas', 'Banca Movil', 'IMMS', 'Nominas', 'Prenomina', 'Timbrado', 'Contabilidad', 'Juridico', 'Tesoreria', 'Nomina Administrativa', 'Gerencia', 'Almacen']
    res.render('pages/activos/asignarEquipos', { user, rol: user.rol, titulo: 'Bienvenido', ubicaciones, departamentos })
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
}

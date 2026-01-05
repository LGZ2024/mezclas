import { SalidaCombustibleModel } from '../../models/combustible_salida.models.js'
import { EntradaCombustibleModel } from '../../models/combustible_entrada.models.js'
import { CargaCombustibleModel } from '../../models/combustible_carga.models.js'
import { ProduccionModel } from '../../models/produccion.models.js'

export class CommonPageController {
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

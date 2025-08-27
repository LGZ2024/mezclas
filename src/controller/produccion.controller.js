import { asyncHandler } from '../utils/asyncHandler.js'

export class ProduccionController {
  constructor ({ produccionModel }) {
    this.produccionModel = produccionModel
  }

  // extraer
  ObtenerGastoUsuario = async (req, res) => {
    try {
      const centroCoste = await this.produccionModel.ObtenerGastoUsuario({ tipo: req.params.tipo })
      if (centroCoste.error) {
        res.status(404).json({ error: `${centroCoste.error}` })
      }
      res.json(centroCoste)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  solicitudReporte = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de reporte',
      name: user.nombre,
      userRol: user.rol,
      userId: user.id
    }
    logger.info('Iniciando controlador de solicitud de reporte de mezclas', logContext)
    const centroCoste = await this.produccionModel.solicitudReporte({ empresa: user.empresa, rol: user.rol, idUsuario: user.id, logger, logContext })
    if (centroCoste.error) {
      res.status(404).json({ error: `${centroCoste.error}` })
    }
    logger.info('Finalizando controlador de solicitud de reporte de mezclas', logContext)

    res.json(centroCoste)
  })

  descargarEcxel = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarEcxel({ datos: req.body })
      if (buffer.error) {
        res.status(404).json({ error: `${buffer.error}` })
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx')
      res.send(buffer)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  descargarSolicitud = asyncHandler(async (req, res) => {
    const buffer = await this.produccionModel.descargarSolicitud({ datos: req.body })
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx')
    res.send(buffer)
  })

  descargarReporte = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'descargar reporte',
      userName: user.nombre,
      userRol: user.rol,
      userId: user.id
    }
    logger.info('Iniciando controlador de descarga reprote', logContext)
    const buffer = await this.produccionModel.descargarReporte({ datos: req.body, logContext, logger })
    logger.info('Finalizando controlador de descarga reprote', logContext)
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx')
    res.send(buffer)
  })

  descargarReporteV2 = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'descargar reporte v2',
      userName: user.nombre,
      userRol: user.rol,
      userId: user.id
    }
    logger.info('Iniciando Controlador descarga reporte', logContext)
    const buffer = await this.produccionModel.descargarReporteV2({ datos: req.body })
    if (buffer.error) {
      res.status(404).json({ error: `${buffer.error}` })
    }
    logger.info('Finalizando Controlador descarga reporte', logContext)

    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx')
    res.send(buffer)
  })

  descargarReportePendientes = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { empresa } = req.params
    const logger = req.logger
    const logContext = {
      operation: 'Obteniendo datos reporte pendiente',
      name: user.nombre,
      rol: user.rol,
      body: {
        empresa
      }
    }
    let buffer

    logger.info('Iniciando Controlador', logContext)
    if (empresa === 'todo') {
      buffer = await this.produccionModel.descargarReportePendientesCompleto({ logger, logContext })
    } else {
      buffer = await this.produccionModel.descargarReportePendientes({ empresa: empresa || user.empresa, logger, logContext })
    }
    logger.info('Controldaor Finalizado', logContext)
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx')
    res.send(buffer)
  })

  ObtenerReceta = asyncHandler(async (req, res) => {
    try {
      const buffer = await this.produccionModel.ObtenerReceta()
      if (buffer.error) {
        res.status(404).json({ error: `${buffer.error}` })
      }
      res.json(buffer)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  })

  ObtenerActivosFijos = asyncHandler(async (req, res) => {
    try {
      const activosFijos = await this.produccionModel.ObtenerActivosFijos()
      res.json(activosFijos)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  })

  ObtenerAsignacionActivos = asyncHandler(async (req, res) => {
    const data = await this.produccionModel.ObtenerAsignacionActivos()
    res.json({ success: true, data })
  })

  ObtenerActivosBaja = asyncHandler(async (req, res) => {
    try {
      const activosBaja = await this.produccionModel.ObtenerActivosBaja()
      res.json(activosBaja)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  })

  ObtenerAsignacionHistorial = asyncHandler(async (req, res) => {
    try {
      const asignacionHistorial = await this.produccionModel.ObtenerAsignacionHistorial()
      res.json(asignacionHistorial)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  })

  ObtenerEquipoHistorial = asyncHandler(async (req, res) => {
    const equipoHistorial = await this.produccionModel.ObtenerEquipoHistorial()
    res.json(equipoHistorial)
  })
}

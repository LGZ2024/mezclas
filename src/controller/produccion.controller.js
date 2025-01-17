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

  solicitudReporte = async (req, res) => {
    const { user } = req.session
    try {
      const centroCoste = await this.produccionModel.solicitudReporte({ empresa: user.empresa, rol: user.rol })
      if (centroCoste.error) {
        res.status(404).json({ error: `${centroCoste.error}` })
      }
      res.json(centroCoste)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

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

  descargarSolicitud = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarSolicitud({ datos: req.body })
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

  descargarReporte = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarReporte({ datos: req.body })
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

  descargarReporteV2 = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarReporteV2({ datos: req.body })
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

  ObtenerReceta = async (req, res) => {
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
  }
}

export class CentroController {
  constructor ({ centroModel }) {
    this.centroModel = centroModel
  }

  // extraer
  getCentrosPorRancho = async (req, res) => {
    const { rancho } = req.params
    const { user } = req.session
    let centroCoste
    try {
      // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
      if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
        centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: 'Fresa' })
      } else {
        centroCoste = await this.centroModel.getCentrosPorRancho({ rancho, cultivo: user.cultivo })
      }
      if (centroCoste.error) {
        res.status(404).json({ error: `${centroCoste.error}` })
      }
      res.json(centroCoste)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // extraer un solo variedades
  getVariedadPorCentroCoste = async (req, res) => {
    const { id } = req.params

    try {
      const variedad = await this.centroModel.getVariedadPorCentroCoste({ id })
      if (variedad.error) {
        res.status(404).json({ error: `${variedad.error}` })
      }
      res.json(variedad)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // extraer un solo variedades
  getAll = async (req, res) => {
    try {
      const variedad = await this.centroModel.getAll()
      if (variedad.error) {
        res.status(404).json({ error: `${variedad.error}` })
      }
      res.json(variedad)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // actualizar porcentajes de las variedades
  porcentajeVariedad = async (req, res) => {
    try {
      const result = await this.centroModel.porcentajeVariedad({ id: req.body.centroCoste, data: req.body.porcentajes })
      if (result.error) {
        res.status(404).json({ error: `${result.error}` })
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error({ error: `${error}` })
      return res.status(500).render('500', { error: 'Error interno del servidor' })
    }
  }
}

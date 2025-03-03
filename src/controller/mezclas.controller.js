import { enviarCorreo } from '../config/smtp.js'
import { UsuarioModel } from '../models/usuario.models.js'
import { format } from 'date-fns'
export class MezclasController {
  constructor ({ mezclaModel }) {
    this.mezclaModel = mezclaModel
  }

  // crear solicitudes
  create = async (req, res) => {
    let ress
    try {
      // obtenemos los datos de la sesion
      const { user } = req.session

      // Acceder a los datos de FormData
      const result = await this.mezclaModel.create({ data: req.body, idUsuario: user.id })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      // procesar fecha
      const fechaSolicitud = new Date(result.fechaSolicitud)
      const fechaFormateada = format(fechaSolicitud, 'dd/MM/yyyy HH:mm:ss')

      // estos usuarios les llegaran todas las notificaciones
      const r2 = await UsuarioModel.getUserEmailEmpresa({ rol: 'administrativo', empresa: 'General' })

      // obtenemos los datos del usuario al que mandaremos el correo
      if (req.body.rancho === 'Atemajac' || req.body.rancho === 'Ahualulco') {
        const r1 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: req.body.empresaPertece, rancho: req.body.rancho })
        ress = [...r1, ...r2]
      } else if (req.body.rancho === 'Seccion 7 Fresas') {
        const r1 = await UsuarioModel.getUserEmailRancho({ rol: 'mezclador', empresa: 'Bioagricultura', rancho: 'Atemajac' })
        ress = [...r1, ...r2]
      } else {
      // obtenemos los datos del usuario al que mandaremos el correo
        const r1 = await UsuarioModel.getUserEmail({ rol: 'mezclador', empresa: req.body.empresaPertece })
        ress = [...r1, ...r2]
      }
      if (ress && !ress.error) {
        // Usar forEach para mapear los resultados
        ress.forEach(async usuario => {
          console.log(`nombre:${usuario.nombre}, correo:${usuario.email}`)
          const respues = await enviarCorreo({ type: 'solicitud', email: usuario.email, nombre: usuario.nombre, solicitudId: result.idSolicitud, fechaSolicitud: fechaFormateada, data: req.body, usuario: user })
          // validamos los resultados
          if (respues.error) {
            console.error('Error al enviar correo:', respues.error)
          } else {
            console.log('Correo enviado:', respues.messageId)
          }
        })
      } else {
        console.error(ress.error || 'No se encontraron usuarios')
      }
      return res.json({ message: result.message })
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // pasar a proceso
  estadoProceso = async (req, res) => {
    try {
      const idSolicitud = req.params.idSolicitud
      const result = await this.mezclaModel.estadoProceso({ id: idSolicitud, data: req.body })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      const ress = await UsuarioModel.getOneId({ id: result.idUsuarioSolicita })
      console.log(`nombre:${ress.nombre}, correo:${ress.email}`)
      await enviarCorreo({
        type: 'status',
        email: ress.email,
        nombre: ress.nombre,
        solicitudId: idSolicitud,
        status: req.body.status
      })

      return res.json({ message: result.message })
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ error: 'Ocurrió un error al crear la solicitud' })
    }
  }

  // cerrar solicitudes
  cerrarSolicitid = async (req, res) => {
    try {
      // obtenemos los datos de la sesion
      const { user } = req.session
      // Acceder a los datos de FormData
      const result = await this.mezclaModel.cerrarSolicitid({ data: req.body, idUsuario: user.id })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      const ress = await UsuarioModel.getOneId({ id: result.idUsuarioSolicita })
      console.log(`nombre:${ress.nombre}, correo:${ress.email}`)
      await enviarCorreo({
        type: 'status',
        email: ress.email,
        nombre: ress.nombre,
        solicitudId: result.id,
        status: result.status,
        usuario: user,
        data: {
          rancho: result.rancho || req.body.rancho, // Usar el rancho del resultado o del body
          descripcion: result.descripcion || req.body.descripcion,
          folio: result.folio || req.body.folio
        }
      })

      return res.json({ message: result.message })
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }

  obtenerTablaMezclasEmpresa = async (req, res) => {
    try {
      const { user } = req.session
      console.log('user', user)
      const { status } = req.params

      if (!status) {
        return res.status(400).json({ error: 'El estado es requerido' })
      }

      // Inicializar result como un array vacío
      let result = []

      switch (user.rol) {
        case 'mezclador':
          if (user.ranchos === 'General') {
            result = await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa })
          } else if (user.ranchos === 'Atemajac') {
            const r1 = await this.mezclaModel.obtenerTablaMezclasRancho({ status, ranchoDestino: user.ranchos })
            const r2 = await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: 'Lugar Agricola' }) ? await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: 'Lugar Agricola' }) : []
            result = [...r1, ...r2]
          } else {
            result = await this.mezclaModel.obtenerTablaMezclasRancho({ status, ranchoDestino: user.ranchos })
          }
          break
        case 'solicita':
          result = await this.mezclaModel.obtenerTablaMezclasUsuario({ status, idUsuarioSolicita: user.id })
          break
        case 'solicita2':
          result = await this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa })
          break
        case 'supervisor':
          result = await this.mezclaModel.getAll()
          break
        case 'administrativo': {
          if (user.empresa === 'General' && user.ranchos) {
            result = await this.mezclaModel.getAllGeneral({ status })
          } else {
            const [res2, res1] = await Promise.all([
              this.mezclaModel.obtenerTablaMezclasEmpresa({ status, empresa: user.empresa }),
              this.mezclaModel.obtenerTablaMezclasUsuario({ status, idUsuarioSolicita: user.id })
            ])
            // Verificar y combinar resultados
            if (Array.isArray(res2)) {
              result = result.concat(res2) // Agregar res2 si es un array
            }
            if (Array.isArray(res1)) {
              result = result.concat(res1) // Agregar res1 si es un array
            }
            // Eliminar duplicados basados en un campo único, por ejemplo, 'id'
            const uniqueIds = new Set()
            const uniqueResults = result.filter(item => {
              if (!uniqueIds.has(item.id)) { // Cambia 'id' por el campo que identifique de manera única
                uniqueIds.add(item.id)
                return true
              }
              return false
            })

            // Verificar si hay resultados
            if (uniqueResults.length === 0) {
              return res.status(404).json({ message: 'No se encontraron mezclas' })
            }

            // Asignar los resultados únicos a result
            result = uniqueResults
          }

          break
        }
        default:
          return res.status(403).json({ error: 'Rol no autorizado' })
      }

      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json(result.data || result)
    } catch (error) {
      console.error('Error al obtener la tabla de mezclas:', error)
      return res.status(500).json({ mensaje: 'Ocurrió un error al obtener la tabla de mezclas' })
    }
  }

  obtenerTablaMezclasId = async (req, res) => {
    try {
      const id = req.params.id
      const result = await this.mezclaModel.obtenerTablaMezclasId({ id })
      if (result.error) {
        return res.status(400).json({ error: result.error })
      }
      return res.json(result.data)
    } catch (error) {
      console.error('Error al crear la solicitud:', error)
      res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' })
    }
  }
}

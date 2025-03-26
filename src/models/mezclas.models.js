import { Solicitud } from '../schema/mezclas.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Usuario } from '../schema/usuarios.js' // Asegúrate de importar el modelo de Usuario
import { Centrocoste } from '../schema/centro.js' // Asegúrate de importar el modelo de CentroCoste
import { guardarImagen } from '../config/foto.mjs'
import { CentroCosteModel } from '../models/centro.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import sequelize from '../db/db.js'
export class MezclaModel {
  // crear asistencia
  static async create ({ data, idUsuario }) {
    const transaction = await sequelize.transaction()
    let variedades
    try {
      // validamos variedad si viene todo
      if (data.variedad === 'todo') {
        try {
          // Asumiendo que este método existe en tu modelo
          variedades = await CentroCosteModel.getVariedadPorCentroCoste({ id: data.centroCoste })
        } catch (error) {
          console.error('Error al consultar productos para la solicitud', error)
        }
      }
      // Creamos nueva solicitud con transacción
      const solicitud = await Solicitud.create({
        folio: data.folio,
        cantidad: data.cantidad,
        idCentroCoste: data.centroCoste,
        descripcion: data.descripcion,
        empresa: data.empresaPertece,
        idUsuarioSolicita: idUsuario,
        metodoAplicacion: data.metodoAplicacion,
        temporada: data.temporada,
        variedad: data.variedad === 'todo' ? variedades[0].dataValues.variedad : data.variedad,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho,
        porcentajes: data.variedad === 'todo' ? variedades[0].dataValues.porcentajes : '100'
      }, { transaction })

      // Verificar si hay productos y procesar cada uno
      if (data.productos && Array.isArray(data.productos)) {
        // Filtrar productos válidos
        const productosValidos = data.productos.filter(producto =>
          producto.id_producto &&
          producto.unidad_medida &&
          producto.cantidad
        )

        // Validar que haya productos
        if (productosValidos.length === 0) {
          throw new Error('No hay productos válidos para registrar')
        }

        // Procesar productos con manejo de errores mejorado
        const productosPromesas = productosValidos.map(async (producto) => {
          // comprobaramos si el id_producto es numero
          try {
            await SolicitudProductos.create({
              id_solicitud: solicitud.id,
              id_producto: parseInt(producto.id_producto),
              unidad_medida: producto.unidad_medida,
              cantidad: producto.cantidad
            }, { transaction })
            return {
              idProducto: producto.id_producto,
              status: 'success'
            }
          } catch (errorProducto) {
            console.error(`Error al procesar producto ${producto.id_producto}:`, errorProducto)
            return {
              idProducto: producto.id_producto,
              status: 'error',
              message: errorProducto.message
            }
          }
        })

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(productosPromesas)

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado =>
          resultado.status === 'error'
        )

        if (productosConError.length > 0) {
          // Si hay errores, lanzar una excepción con detalles
          throw new Error(`Errores al procesar productos: ${JSON.stringify(productosConError)}`)
        }
      }

      // Confirmar transacción
      await transaction.commit()
      // Retornar mensaje de éxito con ID de solicitud
      return {
        message: 'Solicitud de mezcla registrada correctamente',
        idSolicitud: solicitud.id,
        fechaSolicitud: solicitud.fechaSolicitud
      }
    } catch (error) {
      // Revertir transacción en caso de error
      if (transaction) await transaction.rollback()

      // Loguear error detallado
      console.error('Error al registrar solicitud:', error)

      // Retornar mensaje de error más descriptivo
      return {
        error: 'Error al registrar solicitud',
        detalle: error.message
      }
    }
  }

  static async cerrarSolicitid ({ data, idUsuario }) {
    const id = data.idSolicitud
    const status = 'Completada'
    try {
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) return { error: 'Solicitud no encontrada' }

      // Guardar imagen
      const response = await guardarImagen({ imagen: data.imagen })

      // Actualiza solo los campos que se han proporcionado
      if (response.relativePath) solicitud.imagenEntrega = response.relativePath
      if (status) solicitud.status = status
      if (idUsuario) solicitud.idUsuarioMezcla = idUsuario
      if (response.fecha) solicitud.fechaEntrega = response.fecha

      await solicitud.save()

      return { message: 'Solicitud actualizada correctamente', status, idUsuarioSolicita: solicitud.idUsuarioSolicita, id }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener las solicitudes' }
    }
  }

  static async obtenerTablaMezclasEmpresa ({ status, empresa }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })

      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerTablaMezclasRancho ({ status, ranchoDestino }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerTablaMezclasUsuario ({ status, idUsuarioSolicita }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud',
          'respuestaMezclador'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud,
          respuestaMezclador: m.respuestaMezclador
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerTablaMezclasId ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        }
      })

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: Array.isArray(resultadosFormateados) ? resultadosFormateados : []

      }
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerPorcentajes ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: [
          'porcentajes'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : []
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async estadoProceso ({ id, data }) {
    try {
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) return { error: 'Solicitud no encontrada' }

      // Actualiza solo los campos que se han proporcionado
      if (data.notaMezcla) solicitud.notaMezcla = data.notaMezcla
      if (data.status) solicitud.status = data.status

      await solicitud.save()

      return { message: 'Solicitud actualizada correctamente', idUsuarioSolicita: solicitud.idUsuarioSolicita }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener las solicitudes' }
    }
  }

  static async mensajeSolicita ({ id, mensajes, idUsuario }) {
    try {
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) return { error: 'Solicitud no encontrada' }

      // Actualiza solo los campos que se han proporcionado
      if (mensajes) solicitud.respuestaSolicitud = mensajes

      await solicitud.save()

      // creamos la notificacion para mostrarla a los usuarios
      const notificacion = await NotificacionModel.create({ idSolicitud: id, mensaje: mensajes, idUsuario })
      if (!notificacion) return { error: 'Error al crear la notificacion' }

      return { message: 'Notificacion Guadada Correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al guardar el mensaje de solicitante' }
    }
  }

  static async getAll () {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: Array.isArray(resultadosFormateados) ? resultadosFormateados : []
      }
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async getOneSolicita ({ id, idSolicita }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioSolicita: idSolicita
        },
        attributes: [
          'idUsuarioMezcla',
          'respuestaMezclador'
        ]
      })
      return solicitud || { error: 'Error al obtener la solicitud o No está autorizado' }
    } catch (e) {
      console.error(e.message)
      return { error: 'Error al obtener la solicitud o No está autorizado' }
    }
  }

  static async getOneMesclador ({ id, idSolicita }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioMezcla: idSolicita
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'folio',
          'ranchoDestino',
          'variedad',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'empresa',
          'fechaSolicitud',
          'respuestaSolicitud',
          'respuestaMezclador'
        ]
      })

      // Verificar si se encontraron resultados
      if (!solicitud) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar el resultado
      const m = solicitud.toJSON()
      const resultadoFormateado = {
        id: m.id,
        Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
        fechaSolicitud: m.fechaSolicitud,
        ranchoDestino: m.ranchoDestino,
        empresa: m.empresa,
        centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
        variedad: m.variedad,
        FolioReceta: m.folio,
        temporada: m.temporada,
        cantidad: m.cantidad,
        prensetacion: m.presentacion,
        metodoAplicacion: m.metodoAplicacion,
        descripcion: m.descripcion,
        respuestaSolicitud: m.respuestaSolicitud,
        respuestaMezclador: m.respuestaMezclador
      }

      // Devolver los resultados
      return {
        message: 'Mezcla obtenida correctamente',
        data: resultadoFormateado
      }
    } catch (e) {
      console.error(e.message)
      return { error: 'Error al obtener la solicitud o No está autorizado' }
    }
  }

  static async getAllGeneral ({ status }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: Array.isArray(resultadosFormateados) ? resultadosFormateados : []

      }
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerDatosSolicitud ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: [
          'cantidad',
          'presentacion',
          'metodoAplicacion'
        ]
      })
      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : []
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }
} // fin modelo

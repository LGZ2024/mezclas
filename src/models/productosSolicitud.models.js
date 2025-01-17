import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Solicitud } from '../schema/mezclas.js'
import { Usuario } from '../schema/usuarios.js'
import { Productos } from '../schema/productos.js' // Asegúrate de importar el modelo de Usuario
import { Recetas } from '../schema/recetas.js' // Asegúrate de importar el modelo de Usuario
import sequelize from '../db/db.js'
export class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud ({ idSolicitud }) {
    try {
      const productosSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud
        },
        include: [
          {
            model: Productos, // producto
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Recetas, // Modelo de Recetas
            attributes: ['nombre'] // Campos que quieres obtener del modelo Recetas
          }
        ],
        attributes: [
          'id_receta',
          'id_solicitud',
          'id_producto',
          'id_receta',
          'unidad_medida',
          'cantidad'
        ]
      })

      // Verificar si se encontraron resultados
      if (productosSolicitud.length === 0) {
        return {
          message: 'No se encontraron productos para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      const resultadosFormateados = productosSolicitud.map(productos => {
        const m = productos.toJSON()
        return {
          id_receta: m.id_receta,
          id_solicitud: m.id_solicitud,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : (m.receta ? m.receta.nombre : 'Producto y receta no encontrados'),
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        }
      })

      // Devolver los resultados
      return resultadosFormateados
    } catch (e) {
      console.error('Error al obtener productos:', e.message)
      return {
        error: 'Error al obtener las productos',
        detalle: e.message
      }
    }
  }

  static async obtenerTablaMezclasId ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await SolicitudProductos.findAll({
        where: {
          id
        },
        include: [
          {
            model: Productos, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
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
          'fechaSolicitud',
          'imagenSolicitud'
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
        data: resultadosFormateados
      }
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async create ({ data }) {
    try {
      // Verificar si el usuario ya existe
      const producto = await SolicitudProductos.findOne({
        where: { id_solicitud: data.idSolicitud, id_producto: data.producto }
      })

      if (producto) {
        return { error: 'producto ya existe en la solicitud' }
      }
      // Llamar al procedimiento almacenado
      await SolicitudProductos.create({ id_solicitud: data.idSolicitud, id_producto: data.producto, unidad_medida: data.unidadMedida, cantidad: data.cantidad })

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: `Producto procesado exitosamente: ${data.producto}`
      }
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async actulizarEstado ({ data }) {
    let transaction
    const noExistencia = []
    const estados = {
      estados: [] // Inicializa el array de estados
    }

    try {
      // Iniciar transacción
      transaction = await sequelize.transaction()

      // Verificar si hay productos y procesar cada uno
      if (data && Array.isArray(data.estados)) {
        // Validar que haya estados
        if (data.estados.length === 0) {
          throw new Error('No hay estados válidos para registrar')
        }

        // Procesar estados
        const estadosPromesas = data.estados.map(async (estado) => {
          if (estado.existe === false) {
            noExistencia.push({ id_receta: estado.id_receta })
          }
          try {
            const receta = await SolicitudProductos.findByPk(estado.id_receta, { transaction })
            if (!receta) return { status: 'error', message: 'Producto no encontrado' }

            // Actualiza el estado si existe
            receta.status = estado.existe

            await receta.save({ transaction })

            return { message: 'Producto actualizado correctamente' }
          } catch (errorProducto) {
            console.error('Error al procesar producto', errorProducto)
            return {
              status: 'error',
              message: errorProducto.message
            }
          }
        })

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(estadosPromesas)

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado => resultado.status === 'error')

        if (productosConError.length > 0) {
          throw new Error(`Errores al procesar productos: ${JSON.stringify(productosConError)}`)
        }
      }

      // Confirmar transacción
      await transaction.commit()

      // Si hay productos que no existen, buscar información sobre ellos
      if (noExistencia.length > 0) {
        const idsRecetas = noExistencia.map(item => item.id_receta)
        const datosUsuariSolicita = await SolicitudProductos.findAll({
          where: {
            id_receta: idsRecetas // Obtener todos los id_receta
          },
          include: [
            {
              model: Productos, // producto
              attributes: ['nombre'] // Campos que quieres obtener del usuario
            }
          ],
          attributes: [
            'id_producto',
            'unidad_medida',
            'cantidad'
          ]
        })

        // Verificar si se encontraron resultados
        if (datosUsuariSolicita.length === 0) {
          return {
            message: 'No se encontraron productos para los criterios especificados',
            data: []
          }
        }

        // Transformar los resultados
        const resultadosFormateados = datosUsuariSolicita.map(item => {
          const m = item.toJSON()
          return {
            id_producto: m.id_producto,
            nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : 'Producto no encontrado',
            unidad_medida: m.unidad_medida,
            cantidad: m.cantidad
          }
        })

        estados.estados.push(...resultadosFormateados) // Agregar todos los resultados formateados a estados.estados
      }
      // Retornar mensaje de éxito
      const UsuariSolicita = await Solicitud.findAll({
        where: {
          id: data.id_solicitud // Obtener todos los id_receta
        },
        include: [
          {
            model: Usuario, // producto
            attributes: ['nombre', 'email'] // Campos que quieres obtener del usuario
          }
        ],
        attributes: ['folio']
      })
      const resultadosFormateado = UsuariSolicita.map(item => {
        const m = item.toJSON()
        return {
          nombre: m.usuario && m.usuario.nombre ? m.usuario.nombre : 'No se encontro Nombre',
          email: m.usuario && m.usuario.email ? m.usuario.email : 'No se encontro Correo'
        }
      })
      return {
        data: resultadosFormateado,
        productos: estados.estados,
        message: 'Solicitud de mezcla registrada correctamente'
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

  static async EliminarPorducto ({ id }) {
    try {
      // Comprobar que el producto exista
      const producto = await SolicitudProductos.findByPk(id) // Usar findByPk correctamente
      if (!producto) return { error: 'Producto no encontrado' }

      // Eliminar el producto
      await producto.destroy()
      return { message: `Producto eliminado correctamente con id ${id}` }
    } catch (e) {
      console.error('Error al eliminar el producto:', e.message) // Registrar el error
      return { error: 'Error al eliminar el producto' }
    }
  }
} // fin modelo

import { DbHelper } from '../utils/dbHelper.js'
import { CombustibleCarga } from '../schema/combustible_carga.js'
import { unidadCombustible } from '../schema/catalogo_unidad_combustible.js'
import { NotFoundError, ValidationError, DatabaseError } from '../utils/CustomError.js'

export class CargaCombustibleModel {
  static async agregarCargaCombustible ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await CombustibleCarga.create(datos, { transaction })

        return { message: 'Carga de combustible registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar entrada de combustible:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async obtenerCargasCombustibles ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        const cargas = await CombustibleCarga.findAll({
          include: [{
            model: unidadCombustible,
            attributes: ['id', 'no_economico']
          }],
          attributes: ['id', 'fecha', 'centro_coste', 'cantidad', 'precio', 'combustible', 'responsable', 'km', 'km_recorridos', 'comentario']
        })

        // transormar resultados
        const resultadosFormateados = cargas.map(carga => {
          const m = carga.toJSON()
          return {
            id: m.id,
            fecha: m.fecha,
            no_economico: m.catalogo_unidad_combustible ? m.catalogo_unidad_combustible.no_economico : null,
            centro_coste: m.centro_coste,
            cantidad: m.cantidad,
            precio: m.precio,
            combustible: m.combustible,
            responsable: m.responsable,
            km: m.km,
            km_recorridos: m.km_recorridos,
            rendimineto: (Number(m.cantidad) > 0 && !isNaN(Number(m.km_recorridos)) && !isNaN(Number(m.cantidad)))
              ? parseFloat((Number(m.km_recorridos) / Number(m.cantidad)).toFixed(2))
              : 0,
            comentario: m.comentario
          }
        })
        // Verifica si hay duplicados
        const uniqueData = Array.from(
          new Map(resultadosFormateados.map(item => [item.id, item])).values()
        )
        return uniqueData
      } catch (error) {
        console.log(error)
        logger.error('Error al buscar carga combustible:', {
          ...logContext,
          error: error.message
        })
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al obtener carga combustible')
      }
    })
  }

  static async buscarKilometraje ({ id, logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        // obtener ultimo registro de la unidad
        const ultimoKilometraje = await CombustibleCarga.findOne({
          where: { no_economico: id },
          order: [['fecha', 'DESC']],
          attributes: ['id', 'km']
        })

        if (!ultimoKilometraje) {
          throw new NotFoundError('No se encontraron registros de kilometraje')
        }

        return {
          message: 'Kilometraje obtenido correctamente',
          ultimoKilometraje
        }
      } catch (error) {
        logger.error('Error al buscar kilometraje:', {
          ...logContext,
          error: error.message
        })
        console.log(error)
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al buscar kilometraje')
      }
    })
  }

  static async actualizarUsuario (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const usuario = await CombustibleCarga.findByPk(id)
      if (!usuario) throw new NotFoundError('Usuario no encontrado')

      await usuario.update(datos, { transaction })
      return usuario
    })
  }
}

// Ejemplo de uso:
/*
// Crear usuario
const nuevoUsuario = await EjemploModel.crearUsuario({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  rol: 'usuario'
})

// Buscar usuarios
const usuarios = await EjemploModel.buscarUsuarios({
  rol: 'admin'
})

// Actualizar usuario
const usuarioActualizado = await EjemploModel.actualizarUsuario(1, {
  nombre: 'Juan Modificado'
})
*/

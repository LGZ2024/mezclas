import { Empleados } from '../schema/empleados.js'
import { Op } from 'sequelize' // Agregar esta importación
/**
Los operadores de Sequelize (Op) son necesarios para realizar consultas complejas. Algunos operadores comunes son:
Op.eq: Igual
Op.ne: No igual
Op.gt: Mayor que
Op.lt: Menor que
Op.in: Dentro de un array
Op.like: Búsqueda con comodín
 */
// utils
import { DatabaseError, CustomError, NotFoundError, ValidationError } from '../utils/CustomError.js'
export class EmpleadosModel {
  // uso
  static async getAllEmpleados () {
    try {
      const equipo = await Empleados.findAll({
        where: {
          estado: {
            [Op.ne]: 'asignado'
          }
        },
        attributes: ['id', 'nombre', 'apellido_paterno']
      })
      if (!equipo) throw new NotFoundError('Empleados no encontrados')
      return equipo
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los equipos')
    }
  }

  static async getDatosEmpleado ({ id }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Empleados.findByPk({
        where: { id },
        attributes: ['nombre', 'apellido_paterno']
      })
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new NotFoundError('No se encontro empleado con id ' + id)
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async agregarUsuario ({ data }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Empleados.findOne({ where: { id_empleado: data.id_empleado } })
      if (usuario) throw new ValidationError('ya existe un empleado con id ' + data.id_empleado)
      // creamos el usuario
      await Empleados.create({ ...data })
      return { message: `Usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los equipos')
    }
  }

  static async actualizarUsuario ({ id, estado }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      const usuario = await Empleados.findByPk(id)
      if (!usuario) throw new NotFoundError('Usuario no encontrado')
      // Actualiza solo los campos que se han proporcionado
      if (estado) usuario.estado = estado
      await usuario.save()
      return { message: 'Usuario actualizado correctamente', id }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar usuario')
    }
  }
}

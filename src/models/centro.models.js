import { Centrocoste } from '../schema/centro.js'

export class CentroCosteModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const usuario = await Centrocoste.findAll({
        attributes: ['id', 'centroCoste', 'empresa', 'rancho', 'cultivo', 'variedad']
      })
      return usuario
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener los usuarios' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const usuario = await Centrocoste.findByPk(id)
      return usuario || { error: 'usuario no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener al usuario' }
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getCentrosPorRancho ({ rancho, cultivo }) {
    let centros
    try {
      if (cultivo === 'General') {
        centros = await Centrocoste.findAll({
          where: {
            rancho
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        })
      } else {
        centros = await Centrocoste.findAll({
          where: {
            rancho,
            cultivo
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        })
      }

      return centros.length > 0 ? centros : { message: 'No se encontraron centros de coste para este rancho' }
    } catch (e) {
      console.error(e.message) // Salida: Error al obtener los centros de coste
      return { error: 'Error al obtener los centros de coste' }
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getVariedadPorCentroCoste ({ id }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          id
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      })

      return variedades.length > 0 ? variedades : { message: 'No se encontraron variedades de este centro de coste' }
    } catch (e) {
      console.error(e.message) // Salida: Error al obtener los variedades de coste
      return { error: 'Error al obtener los variedades de centro de coste' }
    }
  }

  static async getVariedadPorCentroCosteNombre ({ centroCoste }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          centroCoste
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      })

      return variedades.length > 0 ? variedades : { message: 'No se encontraron variedades de este centro de coste' }
    } catch (e) {
      console.error(e.message) // Salida: Error al obtener los variedades de coste
      return { error: 'Error al obtener los variedades de centro de coste' }
    }
  }

  static async porcentajeVariedad ({ id, data }) {
    console.log(id)
    console.log(data)
    try {
      // Verificar si existe el centro de coste
      const centroCoste = await Centrocoste.findByPk(id)
      if (!centroCoste) {
        return {
          success: false,
          error: 'Centro de coste no encontrado'
        }
      }
      console.log(centroCoste)
      // Actualiza solo los campos que se han proporcionado
      if (data) centroCoste.porcentajes = data
      await centroCoste.save()

      return {
        message: 'Porcentajes actualizados correctamente'
      }
    } catch (e) {
      console.error('Error en porcentajeVariedad:', e)
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener el centro de coste' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const usuario = await Centrocoste.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }

      await usuario.destroy()
      return { message: `usuario eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al elimiar el usuario' }
    }
  }

  // crear usuario
  static async create ({ data }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Centrocoste.findOne({ where: { usuario: data.usuario } })
      if (usuario) return { error: 'usuario ya existe' }
      // creamos el usuario
      await Centrocoste.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al crear al usuario' }
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Centrocoste.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre
      if (data.email) usuario.email = data.email
      if (data.rol) usuario.rol = data.rol
      if (data.empresa) usuario.empresa = data.empresa

      await usuario.save()

      return { message: 'usuario actualizada correctamente', rol: data.rol }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener las usuarios' }
    }
  }
}

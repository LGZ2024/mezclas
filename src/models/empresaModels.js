import { Empresa } from '../schema/empresa.js'

export class EmpresaModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const empresas = await Empresa.findAll()
      return empresas
    } catch (e) {
      console.error(e.message) // Salida: Error la empresa
      return { error: 'Error al obtener las empresas' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ id }) {
    try {
      const empresa = await Empresa.findByPk(id)
      return empresa || { error: 'Empresa no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la empresa
      return { error: 'Error al obtener las empresas' }
    }
  }

  // eliminar empresa
  static async delete ({ id }) {
    try {
      const empresa = await Empresa.findByPk(id)
      if (!empresa) return { error: 'empresa no encontrado' }

      await empresa.destroy()
      return { message: `Empresa eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la empresa
      return { error: 'Error al obtener las empresas' }
    }
  }

  // crear empresa
  static async create ({ data }) {
    try {
      await Empresa.create({ ...data })
      return { message: `Empresa registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la empresa
      return { error: 'Error al obtener las empresas' }
    }
  }

  // para actualizar la empresa
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const empresa = await Empresa.findByPk(id)
      if (!empresa) return { error: 'empresa no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) empresa.nombre = data.nombre
      if (data.direccion) empresa.direccion = data.direccion
      if (data.telefono) empresa.telefono = data.telefono
      if (data.correo) empresa.correo = data.correo

      await empresa.save()

      return { message: 'Empresa actualizada correctamente' }
    } catch (e) {
      console.error(e.message) // Salida: Error la empresa
      return { error: 'Error al obtener las empresas' }
    }
  }
}

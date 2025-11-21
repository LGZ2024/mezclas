import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const tipoAplicacionConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de aplicacion es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El tipo de aplicacion debe tener entre 3 y 50 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const TipoAplicacion = sequelize.define('tipo_aplicacion', tipoAplicacionConfig, {
  tableName: 'tipo_aplicacion', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

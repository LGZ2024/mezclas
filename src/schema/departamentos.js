import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const departamentosConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El departamento es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El departamento debe tener entre 3 y 50 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const Departamentos = sequelize.define('departamentos', departamentosConfig, {
  tableName: 'departamentos', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

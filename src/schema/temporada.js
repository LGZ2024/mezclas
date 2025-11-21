import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const empleadosConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  temporada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [3, 20],
        msg: 'La temporada debe tener entre 3 y 20 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const Temporada = sequelize.define('temporada', empleadosConfig, {
  tableName: 'temporada', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

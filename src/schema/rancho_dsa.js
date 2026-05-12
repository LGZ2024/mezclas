import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const ranchoDsaConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_rancho: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ranchos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre_rancho_dsa: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del rancho DSA es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre del rancho DSA debe tener entre 3 y 100 caracteres'
      }
    }
  },
  numero_rancho_dsa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El número de rancho DSA es requerido'
      },
      min: {
        args: 1,
        msg: 'El número de rancho DSA debe ser mayor a 0'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}

export const RanchoDsa = sequelize.define('rancho_dsa', ranchoDsaConfig, {
  tableName: 'rancho_dsa',
  timestamps: true // Agrega createdAt y updatedAt automáticamente
})

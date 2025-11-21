import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const empresasConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La razón social es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La razón social debe tener entre 3 y 50 caracteres'
      }
    }
  },
  nombre_comercial: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre comercial es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre comercial debe tener entre 3 y 50 caracteres'
      }
    }
  },
  rfc: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El RFC es requerido'
      },
      len: {
        args: [12, 13],
        msg: 'El RFC debe tener 12 o 13 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const Empresas = sequelize.define('empresas', empresasConfig, {
  tableName: 'empresas', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

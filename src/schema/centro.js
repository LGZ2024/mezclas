import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const centroConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  centroCoste: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'centroCoste', // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El centro de coste es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El centro de coste debe tener entre 3 y 50 caracteres'
      }
    }
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Empresa pertenece es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La Empresa debe tener entre 3 y 50 caracteres'
      }
    }
  },
  rancho: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El rancho debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cultivo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El cultivo es requerido'
      },
      len: {
        args: [8, 100],
        msg: 'El cultivo debe tener al menos 8 caracteres'
      }
    }
  },
  variedad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La variedad debe tener entre 3 y 50 caracteres'
      }
    }
  },
  porcentajes: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      }
    }
  }
}

export const Centrocoste = sequelize.define('centrocoste', centroConfig, {
  tableName: 'centrocoste', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const combustibleInventario = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  combustible: {
    type: DataTypes.ENUM('Magna', 'Premium', 'Diesel'),
    allowNull: false,
    validate: {
      isIn: [['Magna', 'Premium', 'Diesel']],
      msg: 'el tipo de combustible debe ser: Magna, Premium, Diesel'
    }
  },
  existencia: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'La cantidad debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  almacen: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del almacen no puede estar vacío'
      },
      len: {
        args: [3, 20],
        msg: 'El nombre del almacen debe tener entre 3 y 20 caracteres'
      }
    }
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre de la empresa no puede estar vacío'
      },
      len: {
        args: [3, 20],
        msg: 'El nombre de la empresa debe tener entre 3 y 20 caracteres'
      }
    }
  },
  rancho: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del rancho no puede estar vacío'
      },
      len: {
        args: [3, 20],
        msg: 'El nombre del rancho debe tener entre 3 y 20 caracteres'
      }
    }
  }
}

export const CombustibleInventario = sequelize.define('combustible_inventario', combustibleInventario, {
  tableName: 'combustible_inventario',
  timestamps: false
})

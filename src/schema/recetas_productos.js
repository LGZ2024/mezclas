import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const productosConfig = {
  id_receta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id del producto en nesesario'
      }
    }
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La cantidad es requerida'
      },
      min: {
        args: [0],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El precio por unidad es requerido'
      },
      isFloat: {
        msg: 'El precio debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      },
      max: {
        args: [1000000],
        msg: 'El precio es demasiado alto'
      }
    }
  }
}

export const Productos = sequelize.define('recetas', productosConfig, {
  tableName: 'recetas', // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
})

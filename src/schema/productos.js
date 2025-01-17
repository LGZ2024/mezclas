import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const productosConfig = {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  unidad_medida: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La unidad de medida es requerida para el producto'
      },
      len: {
        args: [2, 20],
        msg: 'El nombre del producto debe tener entre 2 y 20 caracteres'
      }
    }
  }
}

export const Productos = sequelize.define('productos', productosConfig, {
  tableName: 'productos', // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
})

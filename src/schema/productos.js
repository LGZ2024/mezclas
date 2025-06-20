import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const productosConfig = {
  id_producto: {
    type: DataTypes.INTEGER,
    field: 'id_producto',
    primaryKey: true,
    autoIncrement: true
  },
  id_sap: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El id del Sap es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El id del Sap es requerido'
      }
    }
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
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  underscored: true, // Agregar esta línea para usar snake_case
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

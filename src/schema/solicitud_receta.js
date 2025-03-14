import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const productosConfig = {
  id: {
    type: DataTypes.INTEGER,
    field: 'id_receta', // Nombre de columna en la base de datos
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id de la solicitud en nesesario'
      }
    }
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
  unidad_medida: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La unidad de medida es necesaria'
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
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 1
  }
}

export const SolicitudProductos = sequelize.define('solicitud_receta ', productosConfig, {
  tableName: 'solicitud_receta', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const rolesConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  empleado_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Añadir esta línea para evitar duplicados
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
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El rol debe tener entre 3 y 50 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const Roles = sequelize.define('roles', rolesConfig, {
  tableName: 'roles', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

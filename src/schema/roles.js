import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const rolesConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre del rol es requerido' },
      len: { args: [3, 50], msg: 'El nombre debe tener entre 3 y 50 caracteres' }
    }
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}

export const Roles = sequelize.define('roles', rolesConfig, {
  tableName: 'roles', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

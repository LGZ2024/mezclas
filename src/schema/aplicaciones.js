import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const aplicacionConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  id_tipo_aplicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de aplicacion es requerido'
      }
    }
  },
  aplicacion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de aplicacion es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La aplicacion debe tener entre 3 y 50 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const Aplicaciones = sequelize.define('aplicaciones', aplicacionConfig, {
  tableName: 'aplicaciones', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

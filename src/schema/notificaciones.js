import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const notificacionesConfig = {
  id: {
    type: DataTypes.INTEGER,
    field: 'id_notificacion', // Nombre de columna en la base de datos
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
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El mensaje es requerido para mostrar la notificacion'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 1
  }
}

export const Notificaciones = sequelize.define('notificaciones', notificacionesConfig, {
  tableName: 'notificaciones', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

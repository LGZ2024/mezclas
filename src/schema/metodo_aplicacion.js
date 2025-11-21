import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const metodoAplicacionConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El metodo de aplicacion es requerido'
      }
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}

export const MetodoAplicacion = sequelize.define('metodo_aplicacion', metodoAplicacionConfig, {
  tableName: 'metodo_aplicacion', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const asignacionesConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_empleado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El id de empleado es requerido'
      }
    }
  },
  id_equipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El id de equipo es requerido'
      }
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha de asignación es requerida'
      }
    }
  },
  fecha_devolucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La ubicación es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La ubicación debe tener entre 3 y 50 caracteres'
      }
    }
  },
  responsiva: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La Responsiva es requerida'
      },
      len: {
        args: [3, 100],
        msg: 'La Responsiva debe tener entre 3 y 100 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'asignado'
  }
}

export const Asignaciones = sequelize.define('asignaciones', asignacionesConfig, {
  tableName: 'asignaciones', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

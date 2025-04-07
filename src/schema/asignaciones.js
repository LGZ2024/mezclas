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
        msg: 'El centro de coste es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El centro de coste debe tener entre 3 y 50 caracteres'
      }
    }
  },
  id_equipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Empresa pertenece es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La Empresa debe tener entre 3 y 50 caracteres'
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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha de devolución es requerida'
      }
    }
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
        args: [3, 50],
        msg: 'La Responsiva debe tener entre 3 y 50 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El estado es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El estado debe tener entre 3 y 50 caracteres'
      }
    }
  }
}

export const Centrocoste = sequelize.define('asignaciones', asignacionesConfig, {
  tableName: 'asignaciones', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

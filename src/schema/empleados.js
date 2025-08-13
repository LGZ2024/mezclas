import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const empleadosConfig = {
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
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    }
  },
  apellido_paterno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido paterno es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El apellido paterno debe tener entre 3 y 50 caracteres'
      }
    }
  },
  apellido_materno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido materno es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El apellido materno debe tener entre 3 y 50 caracteres'
      }
    }
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El departamento es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El departamento debe tener entre 3 y 50 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'disponible'
  }
}

export const Empleados = sequelize.define('empleados', empleadosConfig, {
  tableName: 'empleados', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

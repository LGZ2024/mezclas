import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'
import bcrypt from 'bcryptjs'

const usuarioConfig = {
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
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El Usuario es obligatorio'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El email es requerido'
      },
      isEmail: {
        msg: 'El email debe ser válido'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es requerida'
      },
      len: {
        args: [8, 100],
        msg: 'La contraseña debe tener al menos 8 caracteres'
      }
    }
  },
  rol: {
    type: DataTypes.ENUM('admin', 'supervisor', 'mezclador', 'solicita', 'administrativo', 'adminMezclador'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol es requerido'
      }
    }
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Sin empresa asignada',
    validate: {
      len: {
        args: [0, 50],
        msg: 'La empresa debe tener entre 3 y 50 caracteres'
      }
    }
  },
  ranchos: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 80],
        msg: 'El rancho debe tener entre 0 y 50 caracteres'
      }
    }
  },
  variedad: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 50],
        msg: 'La variedad debe tener entre 0 y 50 caracteres'
      }
    }
  }
}

export const Usuario = sequelize.define('usuarios', usuarioConfig, {
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario, options) => {
      const salt = await bcrypt.genSalt(10)
      usuario.password = await bcrypt.hash(usuario.password, salt)
    },
    beforeUpdate: async (usuario, options) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10)
        usuario.password = await bcrypt.hash(usuario.password, salt)
      }
    }
  }
})

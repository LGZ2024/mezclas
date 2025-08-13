import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const equiposConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  equipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El equipo es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El equipo debe tener entre 3 y 50 caracteres'
      }
    }
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La marca es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La marca debe tener entre 3 y 50 caracteres'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El modelo es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El modelo debe tener entre 3 y 50 caracteres'
      }
    }
  },
  no_economico: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El numero economico es Requerido'
      },
      len: {
        args: [1, 20],
        msg: 'El numero economico debe tener entre 1 y 20 caracteres'
      }
    }
  },
  ns: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El NS es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El NS debe tener entre 3 y 50 caracteres'
      }
    }
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tag es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El tag debe tener entre 3 y 50 caracteres'
      }
    }
  },
  url_factura: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [1, 100],
        msg: 'La url de la factura debe tener entre 1 y 100 caracteres'
      }
    }
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [1, 100],
        msg: 'La foto debe tener entre 1 y 100 caracteres'
      }
    }
  },
  empresa_pertenece: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [3, 50],
        msg: 'La empresa pertenece debe tener entre 3 y 50 caracteres'
      }
    }
  },
  centro_coste: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [3, 50],
        msg: 'El centro de coste debe tener entre 3 y 50 caracteres'
      }
    }
  },
  fecha_baja: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La fecha de baja es requerida'
      }
    }
  },
  documento_baja: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [3, 100],
        msg: 'El documento de baja debe tener entre 3 y 50 caracteres'
      }
    }
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'disponible'
  }
}

export const Equipos = sequelize.define('equipos', equiposConfig, {
  tableName: 'equipos', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

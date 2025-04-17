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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La url de la factura es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La url de la factura debe tener entre 3 y 50 caracteres'
      }
    }
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La foto es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La foto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  empresa_pertenece: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La empresa pertenece es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La empresa pertenece debe tener entre 3 y 50 caracteres'
      }
    }
  },
  centro_coste: {
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
  fecha_baja: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha de baja es requerida'
      }
    }
  },
  documento_baja: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El documento de baja es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El documento de baja debe tener entre 3 y 50 caracteres'
      }
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha de creación es requerida'
      }
    }
  },
  status: {
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

export const Equipos = sequelize.define('equipos', equiposConfig, {
  tableName: 'equipos', // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})

import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const solicitudServicioConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El responsable es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El responsable debe tener entre 3 y 100 caracteres'
      }
    }
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El kilometraje debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El kilometraje debe ser mayor o igual a 0'
      }
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha debe ser una fecha válida'
      }
    }
  },
  prioridad: {
    type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Urguente'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Baja', 'Media', 'Alta', 'Urguente']],
        msg: 'La prioridad debe ser: Baja, Media, Alta o Ur'
      }
    }
  },
  mantenimiento: {
    type: DataTypes.ENUM('Preventivo', 'Correctivo'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Preventivo', 'Correctivo']],
        msg: 'El Mantenimiento debe ser: Preventivo o Correctivo'
      }
    }
  },
  reparacion_solicitada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La reparación solicitada es requerida'
      },
      len: {
        args: [3, 200],
        msg: 'La reparación solicitada debe tener entre 3 y 200 caracteres'
      }
    }
  },
  taller_asignado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'CatalogoTaller',
      key: 'id'
    },
    validate: {
      isInt: {
        msg: 'El taller asignado debe ser un número entero'
      }
    }
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha de salida debe ser una fecha válida'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'La fecha de salida no puede ser anterior a la fecha actual'
      }
    }
  },
  observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Las observaciones deben tener un máximo de 500 caracteres'
      }
    }
  },
  zona: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'La zona debe tener un máximo de 100 caracteres'
      }
    }
  },
  no_economico: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'El número económico debe tener un máximo de 50 caracteres'
      }
    }
  },
  fecha_factura: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'La fecha de factura debe ser una fecha válida'
      }
    }
  },
  factura: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'El número de factura debe tener un máximo de 100 caracteres'
      }
    }
  },
  reparacion_efectuada: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 200],
        msg: 'La reparación efectuada debe tener un máximo de 200 caracteres'
      }
    }
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: {
        msg: 'El precio debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'El precio debe ser mayor o igual a 0'
      }
    }
  },
  centro_coste: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'El centro de coste debe tener un máximo de 100 caracteres'
      }
    }
  },
  temporada: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La temporada debe tener entre 3 y 50 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'abierto',
    validate: {
      len: {
        args: [3, 50],
        msg: 'El estado debe tener entre 3 y 50 caracteres'
      }
    }
  },
  ranchos: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Los ranchos son requeridos'
      },
      len: {
        args: [3, 50],
        msg: 'El rancho debe tener entre 3 y 50 caracteres'
      }
    }
  }
}

export const SolicitudServicio = sequelize.define('solicitud_servicio', solicitudServicioConfig, {
  tableName: 'solicitud_servicio',
  timestamps: false
})

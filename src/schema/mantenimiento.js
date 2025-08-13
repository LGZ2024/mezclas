import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const mantenimientosConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha debe ser una fecha válida'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'La fecha de devolución no puede ser anterior a la fecha actual'
      }
    }
  },
  no_economico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero economico es requerido'
      }
    }
  },
  tipo_servicio: {
    type: DataTypes.ENUM('Preventivo', 'Correctivo'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Preventivo', 'Correctivo']],
        msg: 'El tipo de servicio debe ser: Preventivo o Correctivo'
      }
    }
  },
  detalles: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Los detalles del mantenimiento son requeridos'
      },
      len: {
        args: [3, 255],
        msg: 'Los detalles del mantenimiento deben tener entre 3 y 255 caracteres'
      }
    }
  },
  prioridad: {
    type: DataTypes.ENUM('Alta', 'Media', 'Baja', 'Urgente'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Alta', 'Media', 'Baja', 'Urgente']],
        msg: 'La prioridad debe ser: Alta, Media, Baja o Urgente'
      }
    }
  },
  taller_asignado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El taller asignado es requerido'
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
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El responsable es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El responsable debe tener entre 3 y 50 caracteres'
      }
    }
  },
  centros_coste: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El centros_coste es requerido'
      }
    }
  },
  tipo_vehiculo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de vehiculo es requerido'
      },

      len: {
        args: [3, 50],
        msg: 'El tipo de vehiculo debe tener entre 3 y 50 caracteres'
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
        msg: 'El kilometraje debe ser mayor a 0'
      }
    }
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'El precio debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'El precio debe ser mayor a 0'
      }
    }
  },
  tipo_pago: {
    type: DataTypes.ENUM('Factura', 'Presupuesto', 'Nota de Credito', 'Nota de Remision'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Factura', 'Presupuesto', 'Nota de Credito', 'Nota de Remision']],
        msg: 'El tipo de pago debe ser: Factura, Presupuesto, Nota de Credito o Nota de Remision'
      }
    }
  },
  factura: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La factura es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La factura debe tener entre 3 y 50 caracteres'
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
  },
  folio_sap: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
    }
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

export const Mantenimientos = sequelize.define('manteniminetos', mantenimientosConfig, {
  tableName: 'manteniminetos',
  timestamps: false
})

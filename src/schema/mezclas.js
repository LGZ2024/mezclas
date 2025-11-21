import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const solicitudConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'El folio debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cantidad: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 10],
        msg: 'la cantidad debe tener entre 1 y 10 caracteres'
      }
    }
  },
  idCentroCoste: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idCentroCoste', // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El centro de coste es requerido'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La empresa'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre de la empresa debe tener entre 3 y 100 caracteres'
      }
    }
  },
  fechaSolicitud: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fechaSolicitud', // Nombre de columna en la base de datos
    defaultValue: DataTypes.NOW
  },
  idUsuarioSolicita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idUsuarioSolicita', // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El ID de usuario en nesesario'
      }
    }
  },
  idUsuarioMezcla: {
    type: DataTypes.INTEGER,
    field: 'idUsuarioMezcla', // Nombre de columna en la base de datos
    allowNull: true
  },
  imagenEntrega: {
    type: DataTypes.TEXT,
    field: 'imagenEntrega', // Nombre de columna en la base de datos
    allowNull: true
  },
  metodoAplicacion: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'metodoAplicacion' // Nombre de columna en la base de datos
  },
  notaMezcla: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'notaMezcla', // Nombre de columna en la base de datos
    validate: {
      len: {
        args: [0, 500],
        msg: 'La nota de mezcla no puede exceder 500 caracteres'
      }
    }
  },
  presentacion: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'La presentación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  ranchoDestino: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'ranchoDestino', // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El rancho destino debe tener entre 3 y 100 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Proceso', 'Completada', 'Cancelada'),
    allowNull: true,
    defaultValue: 'Pendiente'
  },
  temporada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      }
    }
  },
  variedad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      }
    }
  },
  fechaEntrega: {
    type: DataTypes.DATEONLY,
    field: 'fechaEntrega', // Nombre de columna en la base de datos
    allowNull: true
  },
  porcentajes: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El porcentaje es requerido'
      }
    }
  },
  respuestaSolicitud: {
    type: DataTypes.STRING,
    field: 'respuestaSolicitud', // Nombre de columna en la base de datos
    allowNull: true
  },
  respuestaMezclador: {
    type: DataTypes.STRING,
    field: 'respuestaMezclador', // Nombre de columna en la base de datos
    allowNull: true
  },
  motivoCancelacion: {
    type: DataTypes.STRING,
    field: 'motivoCancelacion', // Nombre de columna en la base de datos
    allowNull: true
  },
  confirmacion: {
    type: DataTypes.STRING,
    field: 'confirmacion',
    allowNull: true,
    defaultValue: 'Pendiente'
  },
  idUsuarioValida: {
    type: DataTypes.INTEGER,
    field: 'idUsuarioValida',
    allowNull: true
  },
  fechaAplicacion: {
    type: DataTypes.DATEONLY,
    field: 'fechaAplicacion',
    allowNull: true
  },
  idTipoAplicacion: {
    type: DataTypes.INTEGER,
    field: 'idTipoAplicacion',
    allowNull: true
  },
  idAplicacion: {
    type: DataTypes.INTEGER,
    field: 'idAplicacion',
    allowNull: true
  },
  validacion: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}

export const Solicitud = sequelize.define('solicitud', solicitudConfig, {
  tableName: 'solicitudes',
  timestamps: false,
  hooks: {
    beforeValidate: (solicitud) => {
      // Transformaciones antes de validar
      if (solicitud.folio) {
        solicitud.folio = solicitud.folio.trim().toUpperCase()
      }

      // Generar fecha de solicitud si no se proporciona
      if (!solicitud.fechaSolicitud) {
        solicitud.fechaSolicitud = new Date()
      }
    },
    afterCreate: (solicitud) => {
      console.log(`Nueva solicitud creada: ${solicitud.folio}`)
    }
  }
})
Solicitud.associate = (models) => {
  Solicitud.belongsTo(models.Usuario, {
    foreignKey: 'idUsuarioSolicita',
    as: 'usuarioSolicita'
  })

  Solicitud.belongsTo(models.Centrocoste, {
    foreignKey: 'idCentroCoste',
    as: 'centroCosto'
  })
}

import * as __WEBPACK_EXTERNAL_MODULE_express__ from "express";
import * as __WEBPACK_EXTERNAL_MODULE_morgan__ from "morgan";
import * as __WEBPACK_EXTERNAL_MODULE_compression__ from "compression";
import * as __WEBPACK_EXTERNAL_MODULE_helmet__ from "helmet";
import * as __WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__ from "body-parser";
import * as __WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__ from "cookie-parser";
import * as __WEBPACK_EXTERNAL_MODULE_express_fileupload_7aacc68d__ from "express-fileupload";
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_swagger_ui_express_613ebf08__ from "swagger-ui-express";
import * as __WEBPACK_EXTERNAL_MODULE_swagger_jsdoc_4cc0b3b9__ from "swagger-jsdoc";
import * as __WEBPACK_EXTERNAL_MODULE_dotenv__ from "dotenv";
import * as __WEBPACK_EXTERNAL_MODULE_winston__ from "winston";
import * as __WEBPACK_EXTERNAL_MODULE_winston_daily_rotate_file_69928d76__ from "winston-daily-rotate-file";
import * as __WEBPACK_EXTERNAL_MODULE_cors__ from "cors";
import * as __WEBPACK_EXTERNAL_MODULE_express_rate_limit_c965cf1c__ from "express-rate-limit";
import * as __WEBPACK_EXTERNAL_MODULE_jsonwebtoken__ from "jsonwebtoken";
import * as __WEBPACK_EXTERNAL_MODULE_sequelize__ from "sequelize";
import * as __WEBPACK_EXTERNAL_MODULE_bcryptjs__ from "bcryptjs";
import * as __WEBPACK_EXTERNAL_MODULE_fs_promises_f8dae9d1__ from "fs/promises";
import * as __WEBPACK_EXTERNAL_MODULE_nodemailer__ from "nodemailer";
import * as __WEBPACK_EXTERNAL_MODULE_date_fns_f4130be9__ from "date-fns";
import * as __WEBPACK_EXTERNAL_MODULE_uuid__ from "uuid";
import * as __WEBPACK_EXTERNAL_MODULE_exceljs__ from "exceljs";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "express"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_express_namespaceObject = x({ ["Router"]: () => (__WEBPACK_EXTERNAL_MODULE_express__.Router), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express__["default"]) });
;// CONCATENATED MODULE: external "morgan"
var external_morgan_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_morgan_y = (x) => (() => (x))
const external_morgan_namespaceObject = external_morgan_x({  });
;// CONCATENATED MODULE: external "compression"
var external_compression_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_compression_y = (x) => (() => (x))
const external_compression_namespaceObject = external_compression_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_compression__["default"]) });
;// CONCATENATED MODULE: external "helmet"
var external_helmet_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_helmet_y = (x) => (() => (x))
const external_helmet_namespaceObject = external_helmet_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_helmet__["default"]) });
;// CONCATENATED MODULE: external "body-parser"
var external_body_parser_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_body_parser_y = (x) => (() => (x))
const external_body_parser_namespaceObject = external_body_parser_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__["default"]) });
;// CONCATENATED MODULE: external "cookie-parser"
var external_cookie_parser_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_cookie_parser_y = (x) => (() => (x))
const external_cookie_parser_namespaceObject = external_cookie_parser_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__["default"]) });
;// CONCATENATED MODULE: external "express-fileupload"
var external_express_fileupload_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_express_fileupload_y = (x) => (() => (x))
const external_express_fileupload_namespaceObject = external_express_fileupload_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express_fileupload_7aacc68d__["default"]) });
;// CONCATENATED MODULE: external "url"
const external_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
;// CONCATENATED MODULE: external "swagger-ui-express"
var external_swagger_ui_express_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_swagger_ui_express_y = (x) => (() => (x))
const external_swagger_ui_express_namespaceObject = external_swagger_ui_express_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_swagger_ui_express_613ebf08__["default"]) });
;// CONCATENATED MODULE: external "swagger-jsdoc"
var external_swagger_jsdoc_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_swagger_jsdoc_y = (x) => (() => (x))
const external_swagger_jsdoc_namespaceObject = external_swagger_jsdoc_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_swagger_jsdoc_4cc0b3b9__["default"]) });
;// CONCATENATED MODULE: external "dotenv"
var external_dotenv_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_dotenv_y = (x) => (() => (x))
const external_dotenv_namespaceObject = external_dotenv_x({ ["config"]: () => (__WEBPACK_EXTERNAL_MODULE_dotenv__.config), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_dotenv__["default"]) });
;// CONCATENATED MODULE: ./src/utils/swagger.js


(0,external_dotenv_namespaceObject.config)();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mezclas',
      version: '1.0.0',
      description: 'API para el sistema de mezclas',
      contact: {
        name: 'Soporte',
        email: 'soporte@example.com'
      }
    },
    servers: [{
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token no proporcionado o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No autorizado'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};
const swaggerSpec = (0,external_swagger_jsdoc_namespaceObject["default"])(options);
;// CONCATENATED MODULE: external "winston"
var external_winston_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_winston_y = (x) => (() => (x))
const external_winston_namespaceObject = external_winston_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_winston__["default"]) });
;// CONCATENATED MODULE: external "winston-daily-rotate-file"
var external_winston_daily_rotate_file_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_winston_daily_rotate_file_y = (x) => (() => (x))
const external_winston_daily_rotate_file_namespaceObject = external_winston_daily_rotate_file_x({  });
;// CONCATENATED MODULE: ./src/config/env.mjs

external_dotenv_namespaceObject["default"].config();

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
const envs = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  MODE: process.env.MODE,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  MAILTO: process.env.MAILTO,
  NOTIFICATION_ICON: process.env.NOTIFICATION_ICON
};
;// CONCATENATED MODULE: ./src/utils/logger.js




// Definir niveles personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Formato personalizado
const customFormat = external_winston_namespaceObject["default"].format.combine(external_winston_namespaceObject["default"].format.timestamp(), external_winston_namespaceObject["default"].format.json(), external_winston_namespaceObject["default"].format.prettyPrint(), external_winston_namespaceObject["default"].format.printf(({
  timestamp,
  level,
  message,
  ...metadata
}) => {
  return JSON.stringify({
    timestamp,
    level: level.toUpperCase(),
    message,
    ...metadata
  });
}));
const logger_logger = external_winston_namespaceObject["default"].createLogger({
  level: envs.MODE === 'development' ? 'debug' : 'info',
  levels,
  format: customFormat,
  transports: [
  // Logs de error con rotación diaria
  new external_winston_namespaceObject["default"].transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '14d',
    format: customFormat
  }),
  // Logs de advertencia con rotación diaria
  new external_winston_namespaceObject["default"].transports.DailyRotateFile({
    filename: 'logs/warn-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'warn',
    maxFiles: '14d',
    format: customFormat
  }),
  // Logs combinados con rotación diaria
  new external_winston_namespaceObject["default"].transports.DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    format: customFormat
  }),
  // Archivo estático para errores críticos
  new external_winston_namespaceObject["default"].transports.File({
    filename: 'logs/critical-errors.log',
    level: 'error',
    format: customFormat
  })]
});

// Agregar consola en desarrollo
if (envs.MODE !== 'production') {
  logger_logger.add(new external_winston_namespaceObject["default"].transports.Console({
    format: external_winston_namespaceObject["default"].format.combine(external_winston_namespaceObject["default"].format.colorize(), external_winston_namespaceObject["default"].format.simple())
  }));
}

// Agregar métodos de conveniencia
logger_logger.startOperation = (operationName, metadata = {}) => {
  logger_logger.info(`Iniciando operación: ${operationName}`, metadata);
};
logger_logger.endOperation = (operationName, metadata = {}) => {
  logger_logger.info(`Finalizando operación: ${operationName}`, metadata);
};
logger_logger.logError = (error, metadata = {}) => {
  logger_logger.error({
    message: error.message,
    stack: error.stack,
    ...metadata
  });
};
/* harmony default export */ const utils_logger = (logger_logger);
;// CONCATENATED MODULE: external "cors"
var external_cors_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_cors_y = (x) => (() => (x))
const external_cors_namespaceObject = external_cors_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cors__["default"]) });
;// CONCATENATED MODULE: ./src/middlewares/cors.js

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'https://solicitudmezclas.portalrancho.com.mx', 'https://mezclas.portalrancho.com.mx'];
const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS
} = {}) => (0,external_cors_namespaceObject["default"])({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (!origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
});
;// CONCATENATED MODULE: ./src/middlewares/validateJsonMiddleware.js
const validateJSON = async (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'El cuerpo de la solicitud no es un JSON válido'
    });
  }
  next();
};

;// CONCATENATED MODULE: ./src/middlewares/error500Middleware.js

const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', {
    codeError: '404',
    title: '404 - Página no encontrada',
    errorMsg: 'La página que buscas no fue encontrada.'
  });
};
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log del error
  utils_logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode
  });
  if (false) {} else {
    // Producción: no enviar detalles del error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Algo salió mal'
    });
  }
};
;// CONCATENATED MODULE: external "express-rate-limit"
var external_express_rate_limit_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_express_rate_limit_y = (x) => (() => (x))
const external_express_rate_limit_namespaceObject = external_express_rate_limit_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express_rate_limit_c965cf1c__["default"]) });
;// CONCATENATED MODULE: ./src/middlewares/rateLimit.js

const apiLimiter = (0,external_express_rate_limit_namespaceObject["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutos
  max: 100,
  // máximo 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});
;// CONCATENATED MODULE: external "jsonwebtoken"
var external_jsonwebtoken_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_jsonwebtoken_y = (x) => (() => (x))
const external_jsonwebtoken_namespaceObject = external_jsonwebtoken_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_jsonwebtoken__["default"]) });
;// CONCATENATED MODULE: ./src/middlewares/authMiddleware.js


const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  let decoded = null;
  req.session = {
    user: null
  };
  try {
    if (!token) return res.status(403).render('errorPage', {
      codeError: 403,
      title: '403 - token no proveeido',
      errorMsg: 'No se ha iniciado sesion'
    });
    // Verificamos token
    decoded = await verifyToken(token);
    if (!decoded) return res.status(401).render('errorPage', {
      codeError: 401,
      title: '401 - Token Invalido',
      errorMsg: 'Error de autenticación'
    });
    req.session.user = decoded;
    req.userRole = decoded.userRole; // Establece la propiedad req.userRole
    next();
  } catch (error) {
    req.session.user = null;
    return res.status(401).render('errorPage', {
      codeError: 401,
      title: '401 - Token Invalido',
      errorMsg: 'Error de autenticación'
    });
  }
};
const verifyToken = async token => {
  try {
    const decoded = external_jsonwebtoken_namespaceObject["default"].verify(token, envs.SECRET_JWT_KEY);
    decoded.userRole = decoded.rol; // Agrega la propiedad userRole al objeto decoded
    return decoded;
  } catch (error) {
    return null;
  }
};
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    title: 'Sin Autorizacion',
    errorMsg: 'No autorizado'
  });
  next();
};
const isGeneral = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    errorMsg: 'No autorizado'
  });
  next();
};
const isAdminsitrativoOrAdmin = (req, res, next) => {
  if (req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    title: 'Sin Autorizacion',
    errorMsg: 'No autorizado'
  });
  next();
};
const isSolicitaOrMezclador = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo') return res.status(403).render('errorPage', {
    codeError: 403,
    title: 'Sin Autorizacion',
    errorMsg: 'No autorizado'
  });
  next();
};

;// CONCATENATED MODULE: external "sequelize"
var external_sequelize_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_sequelize_y = (x) => (() => (x))
const external_sequelize_namespaceObject = external_sequelize_x({ ["DataTypes"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.DataTypes), ["Op"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Op), ["Sequelize"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Sequelize) });
;// CONCATENATED MODULE: ./src/db/db.js


// configuraciones
const sequelizeConfig = {
  dialect: 'mysql',
  host: envs.DB_HOST,
  port: 3306,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 20000
  },
  dialectOptions: {
    connectTimeout: 60000 // Aumenta el timeout de conexión
  }
};
const sequelize = new external_sequelize_namespaceObject.Sequelize(sequelizeConfig);
/* harmony default export */ const db = (sequelize);
;// CONCATENATED MODULE: ./src/schema/productos.js


const productosConfig = {
  id_producto: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_sap: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El id del Sap es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El id del Sap es requerido'
      }
    }
  },
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La unidad de medida es requerida para el producto'
      },
      len: {
        args: [2, 20],
        msg: 'El nombre del producto debe tener entre 2 y 20 caracteres'
      }
    }
  }
};
const Productos = db.define('productos', productosConfig, {
  tableName: 'productos',
  // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/utils/CustomError.js
class CustomError_CustomError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos
class CustomError_NotFoundError extends CustomError_CustomError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}
class CustomError_ValidationError extends CustomError_CustomError {
  constructor(message = 'Error de validación') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
class CustomError_DatabaseError extends CustomError_CustomError {
  constructor(message = 'Error en la base de datos') {
    super(message, 500, 'DB_ERROR');
  }
}
;// CONCATENATED MODULE: ./src/models/productos.models.js



class ProductosModel {
  // uso
  static async getAll() {
    try {
      const productos = await Productos.findAll({
        attributes: ['id_producto', 'nombre', 'descripcion', 'unidad_medida']
      });
      if (!productos) throw new CustomError_NotFoundError('productos no encontrados');
      return productos;
    } catch (error) {
      throw new CustomError_DatabaseError('Error al obtener los productos');
    }
  }
  static async getOne({
    id
  }) {
    try {
      const producto = await Productos.findByPk(id);
      if (!producto) {
        throw new CustomError_NotFoundError(`Producto con ID ${id} no encontrado`);
      }
      return producto;
    } catch (error) {
      utils_logger.error(`Productos.model Error al obtener el producto: ${error.message}`);
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al obtener el producto');
    }
  }
  static async delete({
    id
  }) {
    try {
      const producto = await Productos.findByPk(id);
      if (!producto) {
        throw new CustomError_NotFoundError(`Producto con ID ${id} no encontrado`);
      }
      await producto.destroy();
      return {
        message: `producto eliminada correctamente con id ${id}`
      };
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al eliminar el producto');
    }
  }

  // crear producto
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el producto
      const producto = await Productos.findOne({
        where: {
          producto: data.producto
        }
      });
      if (producto) throw new CustomError_ValidationError('Producto ya existe');

      // creamos el producto
      await Productos.create({
        ...data
      });
      return {
        message: `Producto registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      utils_logger.error({
        message: 'Error al crear producto',
        error: e.message,
        stack: e.stack,
        method: 'ProductosModel.create'
      });
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al crear el producto');
    }
  }

  // para actualizar datos de producto
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const producto = await Productos.findByPk(id);
      if (!producto) throw new CustomError_NotFoundError(`Producto con ID ${id} no encontrado`);
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) producto.nombre = data.nombre;
      if (data.email) producto.email = data.email;
      if (data.rol) producto.rol = data.rol;
      if (data.empresa) producto.empresa = data.empresa;
      await producto.save();
      return {
        message: 'producto actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      utils_logger.error({
        message: 'Error al actualizar producto',
        error: e.message,
        stack: e.stack,
        method: 'ProductosModel.update'
      });
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar el producto');
    }
  }
}
;// CONCATENATED MODULE: ./src/schema/solicitud_receta.js


const solicitud_receta_productosConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    field: 'id_receta',
    // Nombre de columna en la base de datos
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id de la solicitud en nesesario'
      }
    }
  },
  id_producto: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id del producto en nesesario'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La unidad de medida es necesaria'
      }
    }
  },
  cantidad: {
    type: external_sequelize_namespaceObject.DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La cantidad es requerida'
      },
      min: {
        args: [0],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  status: {
    type: external_sequelize_namespaceObject.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 1
  }
};
const SolicitudProductos = db.define('solicitud_receta ', solicitud_receta_productosConfig, {
  tableName: 'solicitud_receta',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/schema/mezclas.js


const solicitudConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'El folio debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cantidad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 10],
        msg: 'la cantidad debe tener entre 1 y 10 caracteres'
      }
    }
  },
  idCentroCoste: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    field: 'idCentroCoste',
    // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El centro de coste es requerido'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    allowNull: true
  },
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.DATEONLY,
    allowNull: true,
    field: 'fechaSolicitud',
    // Nombre de columna en la base de datos
    defaultValue: external_sequelize_namespaceObject.DataTypes.NOW
  },
  idUsuarioSolicita: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    field: 'idUsuarioSolicita',
    // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El ID de usuario en nesesario'
      }
    }
  },
  idUsuarioMezcla: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    field: 'idUsuarioMezcla',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  imagenEntrega: {
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    field: 'imagenEntrega',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  metodoAplicacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    field: 'metodoAplicacion',
    // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El método de aplicación es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El método de aplicación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  notaMezcla: {
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    allowNull: true,
    field: 'notaMezcla',
    // Nombre de columna en la base de datos
    validate: {
      len: {
        args: [0, 500],
        msg: 'La nota de mezcla no puede exceder 500 caracteres'
      }
    }
  },
  presentacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'La presentación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  ranchoDestino: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    field: 'ranchoDestino',
    // Nombre de columna en la base de datos
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
    type: external_sequelize_namespaceObject.DataTypes.ENUM('Pendiente', 'Proceso', 'Completada', 'Cancelada'),
    allowNull: true,
    defaultValue: 'Pendiente'
  },
  temporada: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [4, 20],
        msg: 'La temporada debe tener entre 4 y 20 caracteres'
      }
    }
  },
  variedad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 100],
        msg: 'La variedad debe tener entre 3 y 100 caracteres'
      }
    }
  },
  fechaEntrega: {
    type: external_sequelize_namespaceObject.DataTypes.DATEONLY,
    field: 'fechaEntrega',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  porcentajes: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El porcentaje es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El porcentaje debe tener entre 3 y 100 caracteres'
      }
    }
  },
  respuestaSolicitud: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    field: 'respuestaSolicitud',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  respuestaMezclador: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    field: 'respuestaMezclador',
    // Nombre de columna en la base de datos
    allowNull: true
  }
};
const Solicitud = db.define('solicitud', solicitudConfig, {
  tableName: 'solicitudes',
  timestamps: false,
  hooks: {
    beforeValidate: solicitud => {
      // Transformaciones antes de validar
      if (solicitud.folio) {
        solicitud.folio = solicitud.folio.trim().toUpperCase();
      }

      // Generar fecha de solicitud si no se proporciona
      if (!solicitud.fechaSolicitud) {
        solicitud.fechaSolicitud = new Date();
      }
    },
    afterCreate: solicitud => {
      console.log(`Nueva solicitud creada: ${solicitud.folio}`);
    }
  }
});
Solicitud.associate = models => {
  Solicitud.belongsTo(models.Usuario, {
    foreignKey: 'idUsuarioSolicita',
    as: 'usuarioSolicita'
  });
  Solicitud.belongsTo(models.Centrocoste, {
    foreignKey: 'idCentroCoste',
    as: 'centroCosto'
  });
};
;// CONCATENATED MODULE: external "bcryptjs"
var external_bcryptjs_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_bcryptjs_y = (x) => (() => (x))
const external_bcryptjs_namespaceObject = external_bcryptjs_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_bcryptjs__["default"]) });
;// CONCATENATED MODULE: ./src/schema/usuarios.js



const usuarioConfig = {
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.ENUM('admin', 'supervisor', 'mezclador', 'solicita', 'administrativo'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol es requerido'
      }
    }
  },
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 50],
        msg: 'La variedad debe tener entre 0 y 50 caracteres'
      }
    }
  }
};
const Usuario = db.define('usuarios', usuarioConfig, {
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario, options) => {
      const salt = await external_bcryptjs_namespaceObject["default"].genSalt(10);
      usuario.password = await external_bcryptjs_namespaceObject["default"].hash(usuario.password, salt);
    },
    beforeUpdate: async (usuario, options) => {
      if (usuario.changed('password')) {
        const salt = await external_bcryptjs_namespaceObject["default"].genSalt(10);
        usuario.password = await external_bcryptjs_namespaceObject["default"].hash(usuario.password, salt);
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/schema/recetas.js


const recetaConfig = {
  id_receta: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [0, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  presentacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [0, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La unidad de medida es necesaria'
      }
    }
  }
};
const Recetas = db.define('recetas', recetaConfig, {
  tableName: 'recetas',
  // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/schema/notificaciones.js


const notificacionesConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    field: 'id_notificacion',
    // Nombre de columna en la base de datos
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id de la solicitud en nesesario'
      }
    }
  },
  id_usuario: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id de la usuario en nesesario'
      }
    }
  },
  mensaje: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El mensaje es requerido para mostrar la notificacion'
      }
    }
  },
  status: {
    type: external_sequelize_namespaceObject.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 1
  }
};
const Notificaciones = db.define('notificaciones', notificacionesConfig, {
  tableName: 'notificaciones',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/models/productosSolicitud.models.js



 // Asegúrate de importar el modelo de Usuario
 // Asegúrate de importar el modelo de Usuario
 // Asegúrate de importar el modelo de Usuario

// utlis


class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud({
    idSolicitud
  }) {
    try {
      const productosSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud
        },
        include: [{
          model: Productos,
          // producto
          attributes: ['nombre', 'id_sap'] // Campos que quieres obtener del usuario
        }, {
          model: Recetas,
          // Modelo de Recetas
          attributes: ['nombre'] // Campos que quieres obtener del modelo Recetas
        }],
        attributes: ['id_receta', 'id_solicitud', 'id_producto', 'unidad_medida', 'cantidad']
      });

      // Verificar si se encontraron resultados
      if (productosSolicitud.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron productos para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = productosSolicitud.map(productos => {
        const m = productos.toJSON();
        return {
          id_receta: m.id_receta,
          id_solicitud: m.id_solicitud,
          id_sap: m.producto.id_sap,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : m.receta ? m.receta.nombre : 'Producto y receta no encontrados',
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener los productos');
    }
  }
  static async obtenerTablaMezclasId({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await SolicitudProductos.findAll({
        where: {
          id
        },
        include: [{
          model: Productos,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        };
      });

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }
  static async obtenerProductoNoDisponibles({
    idSolicitud
  }) {
    try {
      const productoSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud,
          status: 0
        },
        include: [{
          model: Productos,
          // producto
          attributes: ['nombre', 'id_sap'] // Campos que quieres obtener del usuario
        }],
        attributes: ['id_solicitud', 'id_producto', 'unidad_medida', 'cantidad']
      });

      // Verificar si se encontraron resultados
      if (productoSolicitud.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron productos para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = productoSolicitud.map(productos => {
        const m = productos.toJSON();
        return {
          id_solicitud: m.id_solicitud,
          id_sap: m.producto.id_sap,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : m.receta ? m.receta.nombre : 'Producto y receta no encontrados',
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener los producto solicitud');
    }
  }
  static async create({
    data
  }) {
    try {
      // Verificar si el usuario ya existe
      const producto = await SolicitudProductos.findOne({
        where: {
          id_solicitud: data.idSolicitud,
          id_producto: data.producto
        }
      });
      if (producto) {
        throw new CustomError_ValidationError('Producto ya existe en la solicitud');
      }
      // Llamar al procedimiento almacenado
      await SolicitudProductos.create({
        id_solicitud: data.idSolicitud,
        id_producto: data.producto,
        unidad_medida: data.unidadMedida,
        cantidad: data.cantidad
      });

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: `Producto procesado exitosamente: ${data.producto}`
      };
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar producto');
    }
  }

  // uso
  static async EliminarPorducto({
    id
  }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new CustomError_ValidationError('El id debe ser un numero');

      // Comprobar que el producto exista
      const producto = await SolicitudProductos.findByPk(id); // Usar findByPk correctamente
      if (!producto) throw new CustomError_NotFoundError(`Producto con ID ${id} no encontrado`);

      // Eliminar el producto
      await producto.destroy();
      return {
        message: `Producto eliminado correctamente con id ${id}`
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al eliminar el producto');
    }
  }

  /**
   * Actualiza el estado de los productos y crea notificaciones relacionadas
   * @param {Object} params - Parámetros de actualización
   * @param {Object} params.data - Datos de los productos y mensaje
   * @param {string} params.idUsuarioMezcla - ID del mezclador
   * @returns {Promise<Object>} Resultado de la actualización
   */

  static async actualizarEstado({
    data,
    idUsuarioMezcla
  }) {
    let transaction;
    const noExistencia = [];
    const estados = {
      estados: []
    };
    try {
      // Validaciones iniciales
      if (!data?.estados?.length || !idUsuarioMezcla) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }

      // Iniciar transacción
      transaction = await db.transaction();
      utils_logger.info('Iniciando transacción de mezcla');
      // Procesar estados de productos
      const receta = await this.procesarEstadosProductos(data, noExistencia, transaction);
      if (!receta || !receta.dataValues?.id) {
        throw new CustomError_NotFoundError('No se pudo obtener el ID de la solicitud');
      }

      // // Actualizar solicitud y crear notificación
      await this.actualizarSolicitudYNotificacion({
        id: receta.dataValues.id_solicitud,
        idUsuarioMezcla,
        mensaje: data.mensaje,
        transaction
      });

      // Obtener datos del usuario solicitante
      const datosUsuario = await this.obtenerDatosUsuarioSolicitante(data.id_solicitud);
      if (!datosUsuario || !datosUsuario.length) {
        throw new CustomError_NotFoundError('No se encontró el usuario solicitante');
      }

      // crear notificacion
      await this.crearNotificacion({
        id: receta.dataValues.id_solicitud,
        mensaje: `Productos no disponibles para la solicitud ${receta.dataValues.id_solicitud}`,
        idUsuario: datosUsuario[0].idUsuarioSolicita,
        transaction
      });
      utils_logger.verbose({
        message: 'Procesando transacción',
        transactionId: transaction.id,
        steps: ['proceso']
      });
      await transaction.commit();

      // Procesar productos no existentes
      if (noExistencia.length > 0) {
        const productosNoDisponibles = await this.obtenerProductosNoDisponibles(noExistencia);
        estados.estados.push(...productosNoDisponibles);
      }
      return {
        data: datosUsuario,
        productos: estados.estados,
        message: 'Mezcla Guardada correctamente'
      };
    } catch (error) {
      if (transaction) await transaction.rollback();
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al registrar mezcla de productos');
    }
  }

  // Métodos auxiliares
  static async procesarEstadosProductos(data, noExistencia, transaction) {
    let ultimaReceta = null;
    try {
      const estadosPromesas = data.estados.map(async estado => {
        if (!estado.existe) {
          noExistencia.push({
            id_receta: estado.id_receta
          });
        }
        const receta = await SolicitudProductos.findByPk(estado.id_receta, {
          transaction
        });
        if (!receta) {
          throw new Error(`Producto ${estado.id_receta} no encontrado`);
        }
        receta.status = estado.existe;
        await receta.save({
          transaction
        });
        ultimaReceta = receta;
      });
      await Promise.all(estadosPromesas);
      return ultimaReceta;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar estados productos');
    }
  }
  static async actualizarSolicitudYNotificacion({
    id,
    idUsuarioMezcla,
    mensaje,
    transaction
  }) {
    try {
      const solicitud = await Solicitud.findByPk(id, {
        transaction,
        lock: true // Bloqueo explícito
      });
      if (!solicitud) throw new CustomError_NotFoundError('No se encontró la solicitud');
      solicitud.idUsuarioMezcla = idUsuarioMezcla;
      if (mensaje) solicitud.respuestaMezclador = mensaje;
      await solicitud.save({
        transaction
      });
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al actualizar solicitud y notificacion');
    }
  }
  static async crearNotificacion({
    id,
    mensaje,
    idUsuario,
    transaction
  }) {
    try {
      if (!id || !mensaje || !idUsuario) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Crear la notificación
      const notificacionData = {
        id_solicitud: id,
        mensaje,
        id_usuario: idUsuario
      };
      await Notificaciones.create(notificacionData, {
        transaction
      });
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al crear la notificación');
    }
  }
  static async obtenerProductosNoDisponibles(noExistencia) {
    const idsRecetas = noExistencia.map(item => item.id_receta);
    try {
      const productos = await SolicitudProductos.findAll({
        where: {
          id_receta: idsRecetas
        },
        include: [{
          model: Productos,
          attributes: ['nombre']
        }],
        attributes: ['id_producto', 'unidad_medida', 'cantidad']
      });
      // Verificar si se encontraron resultados
      if (productos.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron productos para los criterios especificados');
      }
      return productos.map(item => ({
        id_producto: item.id_producto,
        nombre_producto: item.producto?.nombre || 'Producto no encontrado',
        unidad_medida: item.unidad_medida,
        cantidad: item.cantidad
      }));
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al obtener productos no disponibles');
    }
  }
  static async obtenerDatosUsuarioSolicitante(idSolicitud) {
    try {
      const usuarios = await Solicitud.findAll({
        where: {
          id: idSolicitud
        },
        include: [{
          model: Usuario,
          attributes: ['nombre', 'email']
        }],
        attributes: ['folio', 'idUsuarioSolicita']
      });
      // Verificar si se encontraron resultados
      if (usuarios.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuarios.map(item => ({
        nombre: item.usuario?.nombre || 'No se encontró Nombre',
        email: item.usuario?.email || 'No se encontró Correo',
        idUsuarioSolicita: item.idUsuarioSolicita
      }));
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al obtener datos usuario solicitante');
    }
  }
} // fin modelo
;// CONCATENATED MODULE: ./src/schema/centro.js


const centroConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  centroCoste: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    field: 'centroCoste',
    // Nombre de columna en la base de datos
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
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
  rancho: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El rancho debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cultivo: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El cultivo es requerido'
      },
      len: {
        args: [8, 100],
        msg: 'El cultivo debe tener al menos 8 caracteres'
      }
    }
  },
  variedad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La variedad debe tener entre 3 y 50 caracteres'
      }
    }
  },
  porcentajes: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      }
    }
  }
};
const Centrocoste = db.define('centrocoste', centroConfig, {
  tableName: 'centrocoste',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: external "fs/promises"
var promises_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var promises_y = (x) => (() => (x))
const promises_namespaceObject = promises_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_fs_promises_f8dae9d1__["default"]), ["writeFile"]: () => (__WEBPACK_EXTERNAL_MODULE_fs_promises_f8dae9d1__.writeFile) });
;// CONCATENATED MODULE: ./src/config/foto.mjs




const foto_filename = (0,external_url_namespaceObject.fileURLToPath)("file:///C:/Users/ZARAGOZA051/Desktop/LGZ2024/src/config/foto.mjs");
const foto_dirname = (0,external_path_namespaceObject.dirname)(foto_filename);

// Configuración
const CONFIG = {
  maxSize: 5 * 1024 * 1024,
  // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadDir: external_path_namespaceObject.join(foto_dirname, '..', 'uploads', 'images')
};
const guardarImagen = async ({
  imagen
}) => {
  try {
    utils_logger.info('Guardando imagen...');
    if (!imagen) {
      throw new Error('No se ha enviado ninguna imagen');
    }

    // Validar formato base64
    const matches = imagen.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de imagen no válido');
    }

    // Validar tipo de imagen
    const mimeType = `image/${matches[1]}`;
    if (!CONFIG.allowedTypes.includes(mimeType)) {
      throw new Error('Tipo de imagen no permitido');
    }

    // Validar tamaño
    const buffer = Buffer.from(matches[2], 'base64');
    if (buffer.length > CONFIG.maxSize) {
      throw new Error('Imagen demasiado grande');
    }

    // Verificar y crear directorio
    try {
      const stats = await promises_namespaceObject["default"].stat(CONFIG.uploadDir);
      if (!stats.isDirectory()) {
        throw new Error('La ruta de uploads no es un directorio');
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        utils_logger.info('Creando directorio de uploads...');
        await promises_namespaceObject["default"].mkdir(CONFIG.uploadDir, {
          recursive: true
        });
      } else {
        throw error;
      }
    }

    // Generar nombre único
    const imageExtension = `.${matches[1]}`;
    const imageName = `image_${Date.now()}_${Math.random().toString(36).substring(2)}${imageExtension}`;
    const imagePath = external_path_namespaceObject.join(CONFIG.uploadDir, imageName);

    // Debug: Mostrar ruta completa
    utils_logger.debug('Ruta completa de la imagen:', imagePath);
    try {
      await promises_namespaceObject["default"].writeFile(imagePath, buffer);
      utils_logger.info('Imagen guardada exitosamente');
    } catch (writeError) {
      utils_logger.error('Error al escribir el archivo:', writeError);
      throw new Error(`Error al guardar la imagen: ${writeError.message}`);
    }

    // Verificar que el archivo se haya creado
    try {
      await promises_namespaceObject["default"].access(imagePath);
      utils_logger.info('Archivo verificado correctamente');
    } catch (accessError) {
      utils_logger.error('El archivo no se creó correctamente:', accessError);
      throw new Error('No se pudo verificar la creación del archivo');
    }

    // Formatear fecha
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0];
    utils_logger.info(`ruta absoluta: ${imagePath}`);
    return {
      relativePath: `/uploads/images/${imageName}`,
      fecha: fechaFormateada,
      success: true
    };
  } catch (error) {
    utils_logger.error('Error en guardarImagen:', error);
    throw error;
  }
};
;// CONCATENATED MODULE: ./src/models/centro.models.js

// utils

class CentroCosteModel {
  // uso
  static async getAll() {
    try {
      const centroCoste = await Centrocoste.findAll({
        attributes: ['id', 'centroCoste', 'empresa', 'rancho', 'cultivo', 'variedad']
      });
      if (!centroCoste) throw new CustomError_NotFoundError('Centro de coste no encontrados');
      return centroCoste;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener los centros de coste');
    }
  }

  // uso
  static async getCentrosPorRancho({
    rancho,
    cultivo
  }) {
    let centros;
    try {
      // validamos datos
      if (!rancho || !cultivo) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      if (cultivo === 'General') {
        centros = await Centrocoste.findAll({
          where: {
            rancho
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        });
      } else {
        centros = await Centrocoste.findAll({
          where: {
            rancho,
            cultivo
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        });
      }
      if (!centros) throw new CustomError_NotFoundError('No se encontraron centros de coste para este rancho');
      return centros;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener los centros de coste');
    }
  }

  // uso
  static async getVariedadPorCentroCoste({
    id
  }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new CustomError_ValidationError('El id debe ser un numero');
      const variedades = await Centrocoste.findAll({
        where: {
          id
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      });
      if (!variedades) throw new CustomError_NotFoundError('No se encontraron variedades de este centro de coste');
      return variedades;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener los variedades de centro de coste');
    }
  }

  // uso
  static async porcentajeVariedad({
    id,
    data
  }) {
    try {
      // validados datos
      if (!id || !data) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Verificar si existe el centro de coste
      const centroCoste = await Centrocoste.findByPk(id);
      if (!centroCoste) {
        throw new CustomError_NotFoundError('Centro de coste no encontrado');
      }
      // Actualiza solo los campos que se han proporcionado
      if (data) centroCoste.porcentajes = data;
      await centroCoste.save();
      return {
        message: 'Porcentajes actualizados correctamente'
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar porcentajes');
    }
  }
  static async getOne({
    id
  }) {
    try {
      const usuario = await Centrocoste.findByPk(id);
      return usuario || {
        error: 'usuario no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener al usuario'
      };
    }
  }
  static async getVariedadPorCentroCosteNombre({
    centroCoste
  }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          centroCoste
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      });
      return variedades.length > 0 ? variedades : {
        message: 'No se encontraron variedades de este centro de coste'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error al obtener los variedades de coste
      return {
        error: 'Error al obtener los variedades de centro de coste'
      };
    }
  }
  static async delete({
    id
  }) {
    try {
      const usuario = await Centrocoste.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      await usuario.destroy();
      return {
        message: `usuario eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al elimiar el usuario'
      };
    }
  }
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Centrocoste.findOne({
        where: {
          usuario: data.usuario
        }
      });
      if (usuario) return {
        error: 'usuario ya existe'
      };
      // creamos el usuario
      await Centrocoste.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al crear al usuario'
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/models/notificaciones.models.js

// utils

class NotificacionModel {
  // uso
  static async create({
    idSolicitud,
    mensaje,
    idUsuario
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!idSolicitud || !mensaje || !idUsuario) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // creamos el notificacion
      await Notificaciones.create({
        id_solicitud: idSolicitud,
        mensaje,
        id_usuario: idUsuario
      });
      return {
        message: `notificacion registrado exitosamente ${idSolicitud}`
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al crear la notificacion');
    }
  }

  // uso
  static async getAllIdUsuario({
    idUsuario
  }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(idUsuario)) throw new CustomError_ValidationError('El id debe ser un numero');
      const notificacion = await Notificaciones.findAll({
        where: {
          id_usuario: idUsuario,
          status: 1
        },
        attributes: ['id', 'id_solicitud', 'id_usuario', 'mensaje', 'status']
      });
      if (!notificacion) throw new CustomError_NotFoundError('notificaciones no encontradas');
      return notificacion;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las notificaciones');
    }
  }

  // uso
  static async updateStatus({
    id
  }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new CustomError_ValidationError('El id debe ser un numero');
      const notificacion = await Notificaciones.findByPk(id);
      if (!notificacion) throw new CustomError_NotFoundError('notificacion con id ' + id + ' no encontrada');
      // Actualiza solo los campos que se han proporcionado
      if (id) notificacion.status = 0;
      await notificacion.save();
      return {
        message: 'Notificacion actualizada correctamente'
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar la notificacion');
    }
  }
}
;// CONCATENATED MODULE: ./src/models/mezclas.models.js


 // Asegúrate de importar el modelo de Usuario
 // Asegúrate de importar el modelo de CentroCoste




// utils

class MezclaModel {
  // uso
  static async create({
    data,
    idUsuario
  }) {
    const transaction = await db.transaction();
    let variedad, porcentajes, variedades;
    try {
      // validamos datos
      if (!data || !idUsuario) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // validamos variedad si viene todo
      if (data.variedad === 'todo') {
        try {
          // Asumiendo que este método existe en tu modelo
          variedades = await CentroCosteModel.getVariedadPorCentroCoste({
            id: data.centroCoste
          });

          // Convertir a array, eliminar último elemento y volver a string
          const variedadesArray = variedades[0].dataValues.variedad.split(',').slice(0, -1);
          const porcentajesArray = variedades[0].dataValues.porcentajes.split(',').slice(0, -1);

          // Filtrar ambos arrays en paralelo
          const filtrados = variedadesArray.reduce((acc, variedad, index) => {
            if (parseInt(porcentajesArray[index].trim()) !== 0) {
              acc.variedades.push(variedad);
              acc.porcentajes.push(porcentajesArray[index]);
            }
            return acc;
          }, {
            variedades: [],
            porcentajes: []
          });

          // Convertir de vuelta a strings
          variedad = filtrados.variedades.join(',');
          porcentajes = filtrados.porcentajes.join(',');
        } catch (error) {
          if (error instanceof CustomError_CustomError) throw error;
          throw new CustomError_DatabaseError('Error al consultar productos para la solicitud');
        }
      }
      // Creamos nueva solicitud con transacción
      const solicitud = await Solicitud.create({
        folio: data.folio,
        cantidad: data.cantidad,
        idCentroCoste: data.centroCoste,
        descripcion: data.descripcion,
        empresa: data.empresaPertece,
        idUsuarioSolicita: idUsuario,
        metodoAplicacion: data.metodoAplicacion,
        temporada: data.temporada,
        variedad: data.variedad === 'todo' ? variedad : data.variedad,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho,
        porcentajes: data.variedad === 'todo' ? porcentajes : '100'
      }, {
        transaction
      });

      // Verificar si hay productos y procesar cada uno
      if (data.productos && Array.isArray(data.productos)) {
        // Filtrar productos válidos
        const productosValidos = data.productos.filter(producto => producto.id_producto && producto.unidad_medida && producto.cantidad);

        // Validar que haya productos
        if (productosValidos.length === 0) {
          throw new CustomError_ValidationError('No se encontraron productos válidos para procesar');
        }
        const productosPromesas = productosValidos.map(async producto => {
          // comprobaramos si el id_producto es numero
          try {
            await SolicitudProductos.create({
              id_solicitud: solicitud.id,
              id_producto: parseInt(producto.id_producto),
              unidad_medida: producto.unidad_medida,
              cantidad: producto.cantidad
            }, {
              transaction
            });
            return {
              idProducto: producto.id_producto,
              status: 'success'
            };
          } catch (errorProducto) {
            if (errorProducto instanceof CustomError_CustomError) throw errorProducto;
            throw new CustomError_DatabaseError(`Error al procesar producto ${producto.id_producto}`);
          }
        });

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(productosPromesas);

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado => resultado.status === 'error');
        if (productosConError.length > 0) {
          throw new CustomError_CustomError(`Errores al procesar productos: ${JSON.stringify(productosConError)}`);
        }
      }

      // Confirmar transacción
      await transaction.commit();
      // Retornar mensaje de éxito con ID de solicitud
      return {
        message: 'Solicitud de mezcla registrada correctamente',
        idSolicitud: solicitud.id,
        fechaSolicitud: solicitud.fechaSolicitud
      };
    } catch (error) {
      // Revertir transacción en caso de error
      if (transaction) await transaction.rollback();
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al registrar solicitud de mezcla');
    }
  }

  // uso
  static async cerrarSolicitid({
    data,
    idUsuario
  }) {
    const id = data.idSolicitud;
    const status = 'Completada';
    try {
      // Validar datos
      if (!idUsuario || !data) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) throw new CustomError_NotFoundError('Solicitud con ID ' + id + ' no encontrada');

      // Guardar imagen
      const response = await guardarImagen({
        imagen: data.imagen
      });

      // Actualiza solo los campos que se han proporcionado
      if (response.relativePath) solicitud.imagenEntrega = response.relativePath;
      if (status) solicitud.status = status;
      if (idUsuario) solicitud.idUsuarioMezcla = idUsuario;
      if (response.fecha) solicitud.fechaEntrega = response.fecha;
      await solicitud.save();
      return {
        message: 'Solicitud actualizada correctamente',
        status,
        idUsuarioSolicita: solicitud.idUsuarioSolicita,
        id
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar solicitud');
    }
  }

  // uso
  static async obtenerTablaMezclasEmpresa({
    status,
    empresa
  }) {
    try {
      // Validar datos
      if (!status || !empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega', 'respuestaSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        };
      });

      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }

  // uso
  static async obtenerTablaMezclasRancho({
    status,
    ranchoDestino
  }) {
    try {
      // Validar datos
      if (!status || !ranchoDestino) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega', 'respuestaSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        };
      });

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }

  // uso
  static async obtenerTablaMezclasUsuario({
    status,
    idUsuarioSolicita
  }) {
    try {
      // Validar datos
      if (!status || !idUsuarioSolicita) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega', 'respuestaSolicitud', 'respuestaMezclador']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud,
          respuestaMezclador: m.respuestaMezclador
        };
      });

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }

  // uso
  static async obtenerTablaMezclasId({
    id
  }) {
    try {
      // validar que el id sea un numero
      if (isNaN(id)) throw new CustomError_ValidationError('El id debe ser un numero');
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        };
      });
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }
  static async obtenerPorcentajes({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: ['porcentajes', 'variedad']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }

  // uso para actualizar el estado de proceso
  static async estadoProceso({
    id,
    data
  }) {
    try {
      // validamos datos
      if (!id || !data) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }

      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) throw new CustomError_NotFoundError('Solicitud con ID ' + id + ' no encontrada');

      // Actualiza solo los campos que se han proporcionado
      if (data.notaMezcla) solicitud.notaMezcla = data.notaMezcla;
      if (data.status) solicitud.status = data.status;
      await solicitud.save();
      return {
        message: 'Solicitud Guardada correctamente',
        idUsuarioSolicita: solicitud.idUsuarioSolicita
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar solicitud');
    }
  }

  // uso
  static async mensajeSolicita({
    id,
    mensajes,
    idUsuario
  }) {
    try {
      // validamos datos
      if (!id || !mensajes || !idUsuario) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) throw new CustomError_NotFoundError('Solicitud no encontrada');

      // Actualiza solo los campos que se han proporcionado
      if (mensajes) solicitud.respuestaSolicitud = mensajes;
      await solicitud.save();

      // creamos la notificacion para mostrarla a los usuarios
      await NotificacionModel.create({
        idSolicitud: id,
        mensaje: `Respuesta para solicitud:${id}`,
        idUsuario
      });
      return {
        message: 'Notificacion Guadada Correctamente'
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar solicitud');
    }
  }

  // uso
  static async getAll() {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }
  static async getOneSolicita({
    id,
    idSolicita
  }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioSolicita: idSolicita
        },
        attributes: ['idUsuarioMezcla', 'respuestaMezclador']
      });
      // Verificar si se encontraron resultados
      if (!solicitud) {
        throw new CustomError_NotFoundError('No se encontraron respuestas del mezclador');
      }
      return solicitud;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al respuesta del mezclador');
    }
  }
  static async getOneMesclador({
    id,
    idSolicita
  }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioMezcla: idSolicita
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'folio', 'ranchoDestino', 'variedad', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'empresa', 'fechaSolicitud', 'respuestaSolicitud', 'respuestaMezclador']
      });

      // Verificar si se encontraron resultados
      if (!solicitud) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }

      // Transformar el resultado
      const m = solicitud.toJSON();
      const resultadoFormateado = {
        id: m.id,
        Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
        fechaSolicitud: m.fechaSolicitud,
        ranchoDestino: m.ranchoDestino,
        empresa: m.empresa,
        centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
        variedad: m.variedad,
        FolioReceta: m.folio,
        temporada: m.temporada,
        cantidad: m.cantidad,
        prensetacion: m.presentacion,
        metodoAplicacion: m.metodoAplicacion,
        descripcion: m.descripcion,
        respuestaSolicitud: m.respuestaSolicitud,
        respuestaMezclador: m.respuestaMezclador
      };

      // Devolver los resultados
      return {
        message: 'Mezcla obtenida correctamente',
        data: resultadoFormateado
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener la mezcla');
    }
  }

  // uso
  static async getAllGeneral({
    status
  }) {
    try {
      // Validar datos
      if (!status) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const mezclas = await Solicitud.findAll({
        where: {
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron mezclas para los criterios especificados');
      }
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener las mezclas');
    }
  }

  // uso
  static async obtenerDatosSolicitud({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: ['cantidad', 'presentacion', 'metodoAplicacion']
      });
      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron datos para la solicitud');
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : [];
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener datos para la solicitud');
    }
  }
} // fin modelo
;// CONCATENATED MODULE: ./src/models/usuario.models.js






class UsuarioModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['id', 'nombre', 'usuario', 'email', 'rol', 'empresa', 'ranchos', 'variedad']
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }

  // uso
  static async getUserEmail({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          [external_sequelize_namespaceObject.Op.or]: [{
            empresa
          }, {
            empresa: 'General'
          }]
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }

  // uso
  static async getUserEmailRancho({
    rol,
    empresa,
    rancho
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa || !rancho) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa,
          // Se filtra por empresa
          ranchos: rancho // Se filtra por rancho
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }

  // uso
  static async getUserEmailEmpresa({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa // Se filtra por empresa
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findOne({
        where: {
          rol,
          empresa
        },
        attributes: ['nombre', 'email', 'rol']
      });
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new CustomError_NotFoundError('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }
  static async getOneId({
    id
  }) {
    try {
      if (!id) {
        throw new CustomError_ValidationError('ID no proporcionados');
      }
      const usuario = await Usuario.findOne({
        where: {
          id
        },
        attributes: ['nombre', 'email', 'rol', 'empresa']
      });
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new CustomError_NotFoundError('No se encontro usuario');
      }
      return usuario;
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al obtener todos los usuarios');
    }
  }

  // eliminar usuario
  static async delete({
    id
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id) throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new CustomError_NotFoundError('Usuario no encontrado');
      await usuario.destroy();
      return {
        message: `usuario eliminada correctamente con id ${id}`
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al eliminar usuario');
    }
  }

  // crear usuario
  static async create({
    data
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!data.usuario || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // verificamos que no exista el usuario
      const usuario = await Usuario.findOne({
        where: {
          usuario: data.usuario,
          email: data.email
        }
      });
      if (usuario) throw new CustomError_ValidationError('El usuario o email ya existe');
      // creamos el usuario
      await Usuario.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al crear usuario');
    }
  }

  // para actualizar datos de usuario
  static async update({
    id,
    data
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id || !data.nombre || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre;
      if (data.email) usuario.email = data.email;
      if (data.rol) usuario.rol = data.rol;
      if (data.empresa) usuario.empresa = data.empresa;
      await usuario.save();
      return {
        message: 'usuario actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al actualizar usuario');
    }
  }

  // funcion login
  static async login({
    user,
    password
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!user || !password) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findOne({
        where: {
          usuario: user
        }
      });
      if (!usuario) throw new CustomError_NotFoundError('Usuario no encontrado');
      const isValidPassword = await external_bcryptjs_namespaceObject["default"].compare(password, usuario.password);
      if (!isValidPassword) throw new CustomError_ValidationError('Contraseña incorrecta');

      // creamos jwt
      const token = external_jsonwebtoken_namespaceObject["default"].sign({
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        empresa: usuario.empresa,
        ranchos: usuario.ranchos,
        cultivo: usuario.variedad
      }, envs.SECRET_JWT_KEY, {
        expiresIn: '24h'
      });
      return {
        message: 'Usuario logueado correctamente',
        token,
        rol: usuario.rol
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al iniciar sesión');
    }
  }

  // funcion cambiar contraseña usuario
  static async changePassword({
    id,
    oldPassword,
    newPassword
  }) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      const isValidPassword = await external_bcryptjs_namespaceObject["default"].compare(oldPassword, usuario.password);
      if (!isValidPassword) return {
        error: 'contraseña actual incorrecta'
      };
      usuario.password = newPassword;
      await usuario.save();
      return {
        message: 'contraseña cambiada correctamente'
      };
    } catch (e) {
      console.error(e.message);
      return {
        error: 'Error al cambiar contraseña'
      };
    }
  }

  // funcion cambiar contraseña Admin
  static async changePasswordAdmin({
    id,
    newPassword
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id || !newPassword) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new CustomError_NotFoundError('usuario no encontrado');
      usuario.password = newPassword;
      await usuario.save();
      return {
        message: 'Contraseña cambiada correctamente'
      };
    } catch (e) {
      if (e instanceof CustomError_CustomError) throw e;
      throw new CustomError_DatabaseError('Error al cambiar contraseña');
    }
  }
}
;// CONCATENATED MODULE: ./src/controller/proteted.controller.js




class ProtetedController {
  // ruta Protegida
  protected = async (req, res) => {
    const {
      user
    } = req.session;
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    // validamos al usuario
    if (user.rol === 'admin' || user.rol === 'administrativo') {
      res.status(200).render('pages/admin/solicitudes', {
        user,
        rol: user.rol,
        titulo: 'Bienvenido'
      });
    } else if (user.rol === 'mezclador' || user.rol === 'solicita' || user.rol === 'supervisor' || user.rol === 'solicita2') {
      res.status(200).render('pages/mezclas/main', {
        rol: user.rol,
        nombre: user.nombre
      });
    }
  };

  // ruta vivienda
  solicitud = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',');
    res.render('pages/mezclas/solicitud', {
      ranchos
    });
  };
  solicitudes = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/mezclas/pendientes', {
      rol: user.rol
    });
  };
  proceso = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/mezclas/proceso', {
      rol: user.rol
    });
  };
  completadas = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    const productos = await ProductosModel.getAll();
    res.render('pages/mezclas/completadas', {
      productos
    });
  };
  tablaSolicitudes = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/solicitudes', {
      user,
      titulo: 'hola'
    });
  };
  usuarios = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/usuarios', {
      user,
      titulo: 'hola'
    });
  };
  productos = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/productos', {
      user,
      titulo: 'hola'
    });
  };
  centroCoste = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/centrosCoste', {
      user,
      titulo: 'hola'
    });
  };
  notificacion = async (req, res) => {
    const {
      user
    } = req.session;
    const {
      idSolicitud
    } = req.params;
    let result;

    // verificamos si existe un usuario
    if (!user) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: 'Acceso no utorizado'
      });
    }
    try {
      // validamos el rol de usuario
      switch (user.rol) {
        case 'mezclador':
          {
            result = await MezclaModel.getOneMesclador({
              id: idSolicitud,
              idSolicita: user.id
            });
            if (result.error) {
              throw new Error(result.error);
            }
            return res.render('pages/mezclas/notificacionesMesclador', {
              rol: user.rol,
              idSolicitud,
              data: result.data
            });
          }
        case 'solicita':
          {
            result = await MezclaModel.getOneSolicita({
              id: idSolicitud,
              idSolicita: user.id
            });
            if (result.error) {
              throw new Error(result.error);
            }
            // obtenemos los datos de la solicitud
            console.log(result);
            // si existe alguna solicitud con el mismo usuario pasamos a obtener los productos
            const productos = await SolicitudRecetaModel.obtenerProductoNoDisponibles({
              idSolicitud
            });

            // obtenemos los datos del mezclador que proceso la solicitud
            const mezclador = await UsuarioModel.getOneId({
              id: result.dataValues.idUsuarioMezcla
            });
            return res.render('pages/mezclas/notificaciones', {
              nombre: user.nombre,
              idSolicitud,
              titulo: 'Cambio productos',
              productos,
              nombreMezclador: mezclador.nombre,
              idMezclador: result.dataValues.idUsuarioMezcla,
              empresa: mezclador.empresa,
              respuestaMezclador: result.dataValues.respuestaMezclador
            });
          }
        case 'administrativo':
          {
            // validamos que el usuario sea fransico ya que es el que procesa la solicitud siendo administrativo
            if (user.nombre.trim() !== 'Francisco Alvarez') {
              throw new Error(result.error);
            }
            result = await MezclaModel.getOneSolicita({
              id: idSolicitud,
              idSolicita: user.id
            });
            if (result.error) {
              throw new Error(result.error);
            }
            // si existe alguna solicitud con el mismo usuario pasamos a obtener los productos
            const productos = await SolicitudRecetaModel.obtenerProductoNoDisponibles({
              idSolicitud
            });

            // obtenemos los datos del mezclador que proceso la solicitud
            const mezclador = await UsuarioModel.getOneId({
              id: result.dataValues.idUsuarioMezcla
            });
            return res.render('pages/mezclas/notificaciones', {
              nombre: user.nombre,
              idSolicitud,
              titulo: 'Cambio productos',
              productos,
              nombreMezclador: mezclador.nombre,
              idMezclador: result.dataValues.idUsuarioMezcla,
              empresa: mezclador.empresa,
              respuestaMezclador: result.dataValues.respuestaMezclador
            });
          }
        default:
          return res.status(403).render('errorPage', {
            title: '403 - Sin Autorisacion',
            codeError: '403',
            errorMsg: 'Acceso no utorizado'
          });
      }
    } catch (error) {
      return res.status(403).render('errorPage', {
        title: '403 - Sin Autorisacion',
        codeError: '403',
        errorMsg: error.message
      });
    }
  };

  // cerras sesion
  logout = async (req, res) => {
    try {
      res.clearCookie('access_token');
      return res.redirect('/'); // Asegúrate de usar return aquí
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        error: 'Internal Server Error'
      }); // Asegúrate de usar return aquí
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/proteted.routes.js


// import { isAdmin, isSupervisorOrAdmin, isChecadorOrAdmin } from '../middlewares/authMiddleware.js'

const createProtetedRouter = () => {
  const router = (0,external_express_namespaceObject.Router)();
  const asistenciaController = new ProtetedController();
  // rutas protegidas
  router.get('/admin', asistenciaController.protected);
  router.get('/solicitud', asistenciaController.solicitud);
  router.get('/solicitudes', asistenciaController.solicitudes);
  router.get('/proceso', asistenciaController.proceso);
  router.get('/completadas', asistenciaController.completadas);
  router.get('/tablaSolicitudes', asistenciaController.tablaSolicitudes);
  router.get('/usuarios', asistenciaController.usuarios);
  router.get('/productos', asistenciaController.productos);
  router.get('/centroCoste', asistenciaController.centroCoste);
  router.get('/notificacion/:idSolicitud', asistenciaController.notificacion);

  // cerrar sesion
  router.get('/cerrarSesion', asistenciaController.logout); // logear usuario

  return router;
};
;// CONCATENATED MODULE: external "nodemailer"
var external_nodemailer_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_nodemailer_y = (x) => (() => (x))
const external_nodemailer_namespaceObject = external_nodemailer_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_nodemailer__["default"]) });
;// CONCATENATED MODULE: ./src/config/smtp.js


// utils



// Configuración del transportador SMTP
const createTransporter = () => {
  const transporter = external_nodemailer_namespaceObject["default"].createTransport({
    host: 'portalrancho.com.mx',
    port: 465,
    secure: true,
    auth: {
      user: envs.EMAIL_USER,
      pass: envs.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2' // Versión mínima de TLS
    },
    pool: true,
    debug: true,
    logger: false
  });

  // Verificar conexión
  transporter.verify((error, success) => {
    if (error) {
      utils_logger.error('Error en verificación SMTP:', error);
    } else {
      utils_logger.info('Servidor SMTP listo');
    }
  });
  return transporter;
};

// Función auxiliar para obtener color según el estatus
const getStatusColor = status => {
  const colors = {
    Proceso: '#28a745',
    // Verde
    Completada: '#ffc107',
    // Amarillo
    Rechazado: '#dc3545',
    // Rojo
    default: '#17a2b8' // Azul
  };
  return colors[status] || colors.default;
};

// Función auxiliar para detalles adicionales según estatus
const getAdditionalDetails = status => {
  const details = {
    Proceso: '<p>Su solicitud está siendo procesada. Le mantendremos informado sobre cualquier actualización.</p>',
    Completada: '<p>Su solicitud ha sido <strong>completada</strong>. Para más detalles, por favor contacte a nuestro equipo.</p>',
    default: ''
  };
  return details[status] || details.default;
};

// Función para enviar correo con manejo de errores
const sendMail = async message => {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail(message);
    utils_logger.info('Correo enviado:', {
      messageId: info.messageId,
      response: info.response
    });
    return info;
  } catch (error) {
    utils_logger.error('Error al enviar correo:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};
const validateEmailData = (type, data) => {
  const requiredFields = {
    status: ['email', 'nombre', 'solicitudId', 'status'],
    solicitud: ['email', 'nombre', 'solicitudId', 'fechaSolicitud', 'usuario', 'data'],
    notificacion: ['email', 'nombre', 'solicitudId', 'data'],
    usuario: ['email', 'password'],
    respuestaSolicitante: ['email', 'nombre', 'solicitudId', 'data', 'usuario']
  };
  const fields = requiredFields[type] || [];
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new CustomError_ValidationError(`Faltan campos requeridos para el tipo ${type}: ${missing.join(', ')}`);
  }
};
// Función principal para enviar correos
const enviarCorreo = async params => {
  const {
    type,
    email,
    password = '',
    fechaSolicitud = '',
    nombre = 'Usuario',
    solicitudId = '',
    status = '',
    usuario = {},
    data = {}
  } = params;

  // Validar datos requeridos según el tipo
  validateEmailData(type, params);

  // Configurar mensaje según tipo
  if (!email || !type) {
    throw new CustomError_ValidationError('Email y tipo de mensaje son requeridos');
  }

  // Configurar mensaje según tipo
  const templates = {
    status: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Actualización de Solicitud - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
             <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
                 <h1>Grupo LG</h1>
            </div>
            <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
                <h2>Actualización de Solicitud</h2>
                <p>Estimado(a) ${nombre},</p>
                <p>Le informamos que su solicitud con ID: <b>${solicitudId}</b> ha cambiado de estatus.</p>
                <div style="background-color: ${getStatusColor(status)}; color: white; padding: 10px; border-radius: 5px; text-align: center;">
                    <h3>Estado Actual: ${status}</h3>
                </div>
                <h4>Detalles de la Solicitud:</h4>
                ${getAdditionalDetails(status)}
      
               <a href="https://mezclas.portalrancho.com.mx//protected/${status}" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Ver Detalles de la Solicitud</a>
      
               <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
               <p>Atentamente,<br>El equipo de Grupo LG</p>
          </div>
      </body>`
    },
    usuario: {
      from: '"Registro Portal Checador" <mezclas.rancho@portalrancho.com.mx>',
      subject: 'Usuario Creado Exitosamente',
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
        <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
            <h1>Grupo LG</h1>
        </div>
        <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
            <h2>¡Bienvenido a Grupo LG!</h2>
            <p>Estimado nuevo usuario,</p>
            <p>Nos complace darte la bienvenida a Grupo LG. Tu cuenta ha sido creada exitosamente.</p>
            <p>Para acceder a tu cuenta, por favor utiliza los siguientes datos:</p>
            <ul>
                <li>Nombre de usuario:<b>${email}</b></li>
                <li>Contraseña temporal:<b>${password}</b></li>
            </ul>
             <a href="https://mezclas.portalrancho.com.mx/ style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Iniciar Sesión</a>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
            <p>¡Gracias por unirte a nosotros!</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    solicitud: {
      from: '"Portal de Solicitudes Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Nueva Solicitud Creada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
            <h1>Grupo LG</h1>
        </div>
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
            <h2>Nueva Solicitud Creada</h2>
            <p>Estimado(a) ${nombre},</p>
            <p>Le informamos nueva solicitud ha sido creada con éxito. ID de solicitud es: <b>${solicitudId}</b>.</p>

            <h4>Datos de solicitante:</h4>
            <ul>
                <li><strong>Nombre:</strong> ${usuario.nombre}</li>
                <li><strong>Empresa</strong> ${usuario.empresa}</li>
                <li><strong>Rancho:</strong> ${data.rancho}</li>
            </ul>

            <h4>Detalles de la Solicitud:</h4>
            <ul>
                <li><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</li>
                <li><strong>Descripción:</strong> ${data.descripcion}</li>
                <li><strong>Folio Receta:</strong> ${data.folio}</li>
            </ul>

            <a href="https://mezclas.portalrancho.com.mx/protected/solicitudes" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Detalles de la Solicitud</a>

            <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    notificacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Notificación de No Disponibilidad - ${solicitudId}`,
      html: ` <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
               <div style="background-color: #FF5733; color: white; text-align: center; padding: 20px;">
                   <h1>Grupo LG</h1>
               </div>
               <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
                   <h2>Notificación de No Disponibilidad de Producto</h2>
                   <p>Estimado(a) ${nombre},</p>
                   <p>Le informamos que el producto que solicitó no está disponible en este momento. A continuación, se detallan los datos de los productos sin existencia:</p>
      
                   <h4>Solicitud: <b>${solicitudId}</b></h4>
      
                   <ul>
                      ${Array.isArray(data) ? data.map(product => `
                   <li>
                     <strong>Id del Producto:</strong> ${product.id_producto}<br>
                     <strong>Nombre del Producto:</strong> ${product.nombre_producto}<br>
                     <strong>Unidad de Medida:</strong> ${product.unidad_medida}<br>
                     <strong>cantidad:</strong> ${product.cantidad}
                   </li>
                 `).join('') : '<li>No hay productos para mostrar</li>'}
                   </ul>
      
                   <p>Si desea, podemos ofrecerle alternativas similares o puede optar por omitir los productos. Por favor, háganos saber cómo desea proceder.</p>
                  <div style="text-align: center; margin-top: 20px;">
                      <a href="https://mezclas.portalrancho.com.mx/protected/notificacion/${solicitudId}" 
                        style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Ver Solicitud
                      </a>
                  </div>
                   <p>Si tiene alguna pregunta o necesita más información, no dude en contactar a nuestro equipo de almacen.</p>
                   <p><strong>Encargado de almacen:</strong> ${usuario?.nombre || 'No especificado'}<br></p>
                   <p><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}<br></p>
                   <p><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}<br></p>
                   <p>Atentamente,<br>El equipo de Grupo LG</p>
               </div>
             </body>`
    },
    respuestaSolicitante: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Respuesta de Solicitante - Solicitud ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Respuesta de Solicitante</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Nueva Respuesta del Solicitante</h2>
          
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Ranchos:</strong> ${usuario?.ranchos || 'No especificado'}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Mensaje del Solicitante:</h4>
            <p style="margin-bottom: 0;">${data.mensaje}</p>
          </div>
  
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://mezclas.portalrancho.com.mx/protected/notificacion/${solicitudId}" 
               style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Ver Solicitud
            </a>
          </div>
  
          <p style="margin-top: 20px;">Por favor, revise la respuesta y tome las acciones necesarias.</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Este es un mensaje automático. Si necesita ayuda adicional, contacte al departamento de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    }
  };
  try {
    const template = templates[type];
    if (!template) {
      throw new CustomError_ValidationError(`Tipo de mensaje "${type}" no válido`);
    }
    const message = {
      ...template,
      to: 'zaragoza051@lgfrutas.com.mx' // Reemplazar con el correo del cliente
    };
    const result = await sendMail(message);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    utils_logger.error('Error en enviarCorreo:', error);
    throw error;
  }
};
;// CONCATENATED MODULE: ./src/utils/asyncHandler.js
const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
;// CONCATENATED MODULE: ./src/controller/usuario.controller.js


class UsuarioController {
  constructor({
    usuarioModel
  }) {
    this.usuarioModel = usuarioModel;
  }

  // borra usuario
  delete = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.usuarioModel.delete({
      id
    });
    res.json({
      message: `${result.message}`
    });
  });

  // obtener  usuario
  getAll = asyncHandler(async (req, res) => {
    const usuario = await this.usuarioModel.getAll();
    return res.json(usuario);
  });
  create = asyncHandler(async (req, res) => {
    const result = await this.usuarioModel.create({
      data: req.body
    });
    await enviarCorreo({
      email: req.body.email,
      subject: 'Bienvenido Nuevo Usuario',
      password: req.body.password
    }); // si se creo con exito el usuario enviamos correo con la contraseña
    return res.json({
      message: result.message
    });
  });
  update = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.usuarioModel.update({
      id,
      data: req.body
    });
    return res.json({
      message: result.message
    });
  });
  login = asyncHandler(async (req, res) => {
    const {
      user,
      password
    } = req.body;
    const result = await this.usuarioModel.login({
      user,
      password
    });
    return res.cookie('access_token', result.token, {
      httpOnly: true,
      // la cookie solo se puede acceder en el servidor
      secure: false,
      sameSite: 'strict' // la cookie solo se puede acceder en el mismo dominio
      // maxAge: 60 * 60 * 24 * 30 // la cookie expira
    }).send({
      message: result.message,
      rol: result.rol
    });
  });

  // actualizar contraseña del usuario
  changePassword = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      newPassword
    } = req.body;
    const result = await this.usuarioModel.changePasswordAdmin({
      id,
      newPassword
    });
    return res.json({
      message: result.message
    });
  });

  // obtener una empresa
  getOne = async (req, res) => {
    const {
      id
    } = req.params;
    const usuario = await this.usuarioModel.getOne({
      id
    });
    return res.json(usuario);
  };
}
;// CONCATENATED MODULE: ./src/routes/usuario.routes.js



const createUsuarioRouter = ({
  usuarioModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const usuarioController = new UsuarioController({
    usuarioModel
  });

  // Crear un usuario
  router.post('/', authenticate, isAdmin, usuarioController.create);
  router.get('/', authenticate, isAdmin, usuarioController.getAll);
  router.get('/:id', authenticate, isAdmin, usuarioController.getOne);
  router.patch('/:id', authenticate, isAdmin, usuarioController.update);
  router.delete('/:id', authenticate, isAdmin, usuarioController.delete);
  router.put('/:id', authenticate, isAdmin, usuarioController.changePassword);

  // rutas de inicio de sesion
  router.post('/login', usuarioController.login); // logear usuario

  return router;
};
;// CONCATENATED MODULE: ./src/controller/centro.controller.js

class CentroController {
  constructor({
    centroModel
  }) {
    this.centroModel = centroModel;
  }

  // extraer
  getCentrosPorRancho = asyncHandler(async (req, res) => {
    const {
      rancho
    } = req.params;
    const {
      user
    } = req.session;
    let centroCoste;
    // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
    if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
      centroCoste = await this.centroModel.getCentrosPorRancho({
        rancho,
        cultivo: 'Fresa'
      });
    } else {
      centroCoste = await this.centroModel.getCentrosPorRancho({
        rancho,
        cultivo: user.cultivo
      });
    }
    res.json(centroCoste);
  });
  getVariedadPorCentroCoste = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const variedad = await this.centroModel.getVariedadPorCentroCoste({
      id
    });
    res.json(variedad);
  });
  getAll = asyncHandler(async (req, res) => {
    const variedad = await this.centroModel.getAll();
    res.json(variedad);
  });

  // actualizar porcentajes de las variedades
  porcentajeVariedad = asyncHandler(async (req, res) => {
    const result = await this.centroModel.porcentajeVariedad({
      id: req.body.centroCoste,
      data: req.body.porcentajes
    });
    return res.json({
      message: result.message
    });
  });
}
;// CONCATENATED MODULE: ./src/routes/centro.routes.js


const createCentroCosteRouter = ({
  centroModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const centroController = new CentroController({
    centroModel
  });

  // Obtener centros de coste. pasamos
  router.get('/cc/:rancho', centroController.getCentrosPorRancho);

  // obtener variedades de contros de costo
  router.get('/variedades/:id', centroController.getVariedadPorCentroCoste);

  // obtener todos los centros de costo
  router.get('/centroCoste', centroController.getAll);

  // actualizar los datos del porcentaje de las variedades de contros de costo
  router.post('/porcentajeVariedad', centroController.porcentajeVariedad);
  return router;
};
;// CONCATENATED MODULE: external "date-fns"
var external_date_fns_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_date_fns_y = (x) => (() => (x))
const external_date_fns_namespaceObject = external_date_fns_x({ ["format"]: () => (__WEBPACK_EXTERNAL_MODULE_date_fns_f4130be9__.format) });
;// CONCATENATED MODULE: ./src/controller/mezclas.controller.js






class MezclasController {
  constructor({
    mezclaModel
  }) {
    this.mezclaModel = mezclaModel;
  }

  // crear solicitudes
  create = asyncHandler(async (req, res) => {
    let ress;
    // obtenemos los datos de la sesion
    const {
      user
    } = req.session;

    // Acceder a los datos de FormData
    const result = await this.mezclaModel.create({
      data: req.body,
      idUsuario: user.id
    });

    // procesar fecha
    const fechaSolicitud = new Date(result.fechaSolicitud);
    const fechaFormateada = (0,external_date_fns_namespaceObject.format)(fechaSolicitud, 'dd/MM/yyyy HH:mm:ss');

    // estos usuarios les llegaran todas las notificaciones
    const r2 = await UsuarioModel.getUserEmailEmpresa({
      rol: 'administrativo',
      empresa: 'General'
    });

    // obtenemos los datos del usuario al que mandaremos el correo
    if (req.body.rancho === 'Atemajac' || req.body.rancho === 'Ahualulco') {
      const r1 = await UsuarioModel.getUserEmailRancho({
        rol: 'mezclador',
        empresa: req.body.empresaPertece,
        rancho: req.body.rancho
      });
      const r3 = await UsuarioModel.getUserEmailRancho({
        rol: 'administrativo',
        empresa: 'Bioagricultura',
        rancho: 'General'
      });
      ress = [...r1, ...r2, ...r3];
    } else if (req.body.rancho === 'Seccion 7 Fresas') {
      const r1 = await UsuarioModel.getUserEmailRancho({
        rol: 'mezclador',
        empresa: 'Bioagricultura',
        rancho: 'Atemajac'
      });
      const r3 = await UsuarioModel.getUserEmailRancho({
        rol: 'administrativo',
        empresa: 'Lugar Agricola',
        rancho: 'Seccion 7 Fresas'
      });
      ress = [...r1, ...r2, ...r3];
    } else {
      // obtenemos los datos del usuario al que mandaremos el correo
      const r1 = await UsuarioModel.getUserEmail({
        rol: 'mezclador',
        empresa: req.body.empresaPertece
      });
      ress = [...r1, ...r2];
    }
    if (ress) {
      // Usar forEach para mapear los resultados
      ress.forEach(async usuario => {
        utils_logger.info(`nombre:${usuario.nombre}, correo:${usuario.email}`);
        const respues = await enviarCorreo({
          type: 'solicitud',
          email: usuario.email,
          nombre: usuario.nombre,
          solicitudId: result.idSolicitud,
          fechaSolicitud: fechaFormateada,
          data: req.body,
          usuario: user
        });
        // validamos los resultados
        if (respues.error) {
          utils_logger.error('Error al enviar correo:', respues.error);
        } else {
          utils_logger.info('Correo enviado:', respues.messageId);
        }
      });
    } else {
      utils_logger.debug('No se encontraron usuarios');
    }
    return res.json({
      message: result.message
    });
  });
  estadoProceso = asyncHandler(async (req, res) => {
    const result = await this.mezclaModel.estadoProceso({
      id: req.params.idSolicitud,
      data: req.body
    });
    const ress = await UsuarioModel.getOneId({
      id: result.idUsuarioSolicita
    });
    utils_logger.info(`nombre:${ress.nombre}, correo:${ress.email}`);
    await enviarCorreo({
      type: 'status',
      email: ress.email,
      nombre: ress.nombre,
      solicitudId: req.params.idSolicitud,
      status: req.body.status
    });
    return res.json({
      message: result.message
    });
  });
  notificacion = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    const idSolicitud = req.params.idSolicitud;
    const {
      mensajes,
      idMesclador
    } = req.body;
    const result = await this.mezclaModel.mensajeSolicita({
      id: idSolicitud,
      mensajes,
      idUsuario: idMesclador
    });
    const mezclador = await UsuarioModel.getOneId({
      id: idMesclador
    });
    utils_logger.info(`nombre:${mezclador.nombre}, correo:${mezclador.email}`);
    await enviarCorreo({
      type: 'respuestaSolicitante',
      email: mezclador.email,
      nombre: user.nombre,
      solicitudId: idSolicitud,
      usuario: {
        empresa: user.empresa,
        ranchos: user.ranchos
      },
      data: {
        mensaje: mensajes
      }
    });
    return res.json({
      message: result.message
    });
  });
  cerrarSolicitid = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    // Acceder a los datos de FormData
    const result = await this.mezclaModel.cerrarSolicitid({
      data: req.body,
      idUsuario: user.id
    });
    const ress = await UsuarioModel.getOneId({
      id: result.idUsuarioSolicita
    });
    utils_logger.info(`nombre:${ress.nombre}, correo:${ress.email}`);
    await enviarCorreo({
      type: 'status',
      email: ress.email,
      nombre: ress.nombre,
      solicitudId: result.id,
      status: result.status,
      usuario: user,
      data: {
        rancho: result.rancho || req.body.rancho,
        // Usar el rancho del resultado o del body
        descripcion: result.descripcion || req.body.descripcion,
        folio: result.folio || req.body.folio
      }
    });
    return res.json({
      message: result.message
    });
  });
  obtenerTablaMezclasEmpresa = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    // console.log('user', user)
    const {
      status
    } = req.params;
    if (!status) {
      throw new CustomError_ValidationError('El estado es requerido');
    }
    let result = [];
    switch (user.rol) {
      case 'mezclador':
        if (user.ranchos === 'General') {
          result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: user.empresa
          });
        } else if (user.ranchos === 'Atemajac') {
          const r1 = (await this.mezclaModel.obtenerTablaMezclasRancho({
            status,
            ranchoDestino: user.ranchos
          })) || [];
          const r2 = (await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: 'Lugar Agricola'
          })) || [];
          result = [...(Array.isArray(r1) ? r1 : []), ...(Array.isArray(r2) ? r2 : [])];

          // Validar si hay resultados
          if (result.length === 0) {
            result = []; // Asegurar que retornamos un array vacío
          }
        } else {
          result = await this.mezclaModel.obtenerTablaMezclasRancho({
            status,
            ranchoDestino: user.ranchos
          });
        }
        break;
      case 'solicita':
        result = await this.mezclaModel.obtenerTablaMezclasUsuario({
          status,
          idUsuarioSolicita: user.id
        });
        break;
      case 'solicita2':
        result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
          status,
          empresa: user.empresa
        });
        break;
      case 'supervisor':
        result = await this.mezclaModel.getAll();
        break;
      case 'administrativo':
        {
          if (user.empresa === 'General' && user.ranchos) {
            result = await this.mezclaModel.getAllGeneral({
              status
            });
          } else {
            const [res2, res1] = await Promise.all([this.mezclaModel.obtenerTablaMezclasEmpresa({
              status,
              empresa: user.empresa
            }), this.mezclaModel.obtenerTablaMezclasUsuario({
              status,
              idUsuarioSolicita: user.id
            })]);
            // Verificar y combinar resultados
            if (Array.isArray(res2)) {
              result = result.concat(res2); // Agregar res2 si es un array
            }
            if (Array.isArray(res1)) {
              result = result.concat(res1); // Agregar res1 si es un array
            }
            // Eliminar duplicados basados en un campo único, por ejemplo, 'id'
            const uniqueIds = new Set();
            const uniqueResults = result.filter(item => {
              if (!uniqueIds.has(item.id)) {
                // Cambia 'id' por el campo que identifique de manera única
                uniqueIds.add(item.id);
                return true;
              }
              return false;
            });

            // Asignar los resultados únicos a result
            result = uniqueResults;
          }
          break;
        }
      default:
        return res.status(403).json({
          error: 'Rol no autorizado'
        });
    }
    return res.json(result.data || result);
  });
  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await this.mezclaModel.obtenerTablaMezclasId({
      id
    });
    return res.json(result.data);
  });
}
;// CONCATENATED MODULE: ./src/routes/mezclas.routes.js


const createMezclasRouter = ({
  mezclaModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const mezclasController = new MezclasController({
    mezclaModel
  });

  // Crear solicitud
  router.post('/solicitudes', mezclasController.create);
  router.post('/CerrarSolicitud', mezclasController.cerrarSolicitid); // cerrar mezcla
  router.get('/mezclasSolicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa); // obtener mezclas
  router.get('/mezclasId/:id', mezclasController.obtenerTablaMezclasId); // obtener mezclas con id
  router.patch('/solicitudProceso/:idSolicitud', mezclasController.estadoProceso); // actualizar estado proceso
  router.patch('/notificacion/:idSolicitud', mezclasController.notificacion); // actualizar mensaje de notificacion

  return router;
};
;// CONCATENATED MODULE: ./src/models/recetas.models.js

class RecetasModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const recetas = await Recetas.findAll({
        attributes: ['id_receta', 'nombre', 'descripcion', 'unidad_medida']
      });
      return recetas;
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener los recetas'
      };
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    id
  }) {
    try {
      const recetas = await Recetas.findByPk(id);
      return recetas || {
        error: 'recetas no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener al recetas'
      };
    }
  }

  // eliminar recetas
  static async delete({
    id
  }) {
    try {
      const recetas = await Recetas.findByPk(id);
      if (!recetas) return {
        error: 'recetas no encontrado'
      };
      await recetas.destroy();
      return {
        message: `recetas eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al elimiar el recetas'
      };
    }
  }

  // crear recetas
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el recetas
      const recetas = await Recetas.findOne({
        where: {
          recetas: data.recetas
        }
      });
      if (recetas) return {
        error: 'recetas ya existe'
      };
      // creamos el recetas
      await Recetas.create({
        ...data
      });
      return {
        message: `recetas registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al crear al recetas'
      };
    }
  }

  // para actualizar datos de recetas
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const recetas = await Recetas.findByPk(id);
      if (!recetas) return {
        error: 'recetas no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) recetas.nombre = data.nombre;
      if (data.email) recetas.email = data.email;
      if (data.rol) recetas.rol = data.rol;
      if (data.empresa) recetas.empresa = data.empresa;
      await recetas.save();
      return {
        message: 'recetas actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener las recetass'
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/controller/productos.controller.js


class ProductosController {
  constructor({
    productosModel
  }) {
    this.productosModel = productosModel;
  }
  getAll = asyncHandler(async (req, res) => {
    const productos = await this.productosModel.getAll();
    const recetas = await RecetasModel.getAll();
    res.json({
      productos,
      recetas
    });
  });
  EliminarProducto = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const resultado = await this.productosModel.EliminarProducto({
      id
    });
    res.json(resultado);
  });
}
;// CONCATENATED MODULE: ./src/routes/productos.routes.js


const createProductosRouter = ({
  productosModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const productosController = new ProductosController({
    productosModel
  });

  // Obtener todos los productos
  router.get('/productos', productosController.getAll);
  return router;
};
;// CONCATENATED MODULE: ./src/controller/productosSolicitud.controller.js


class productosSolicitud_controller_ProductosController {
  constructor({
    productossModel
  }) {
    this.productossModel = productossModel;
  }
  obtenerProductosSolicitud = asyncHandler(async (req, res) => {
    const result = await this.productossModel.obtenerProductosSolicitud({
      idSolicitud: req.params.idSolicitud
    });
    return res.json(result);
  });
  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await this.productossModel.obtenerTablaMezclasId({
      id
    });
    return res.json(result.data);
  });
  create = asyncHandler(async (req, res) => {
    const result = await this.productossModel.create({
      data: req.body
    });
    return res.json({
      message: result.message
    });
  });
  actulizarEstado = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    const result = await this.productossModel.actualizarEstado({
      data: req.body,
      idUsuarioMezcla: user.id
    });
    await enviarCorreo({
      type: 'notificacion',
      email: result.data[0].email,
      nombre: result.data[0].nombre,
      solicitudId: req.body.id_solicitud,
      data: result.productos,
      usuario: user
    });
    return res.json({
      message: result.message
    });
  });
  EliminarPorducto = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.productossModel.EliminarPorducto({
      id
    });
    return res.json({
      message: result.message
    });
  });
}
;// CONCATENATED MODULE: ./src/routes/productosSolitud.routes.js


const createProductosSoliRouter = ({
  productossModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const productossController = new productosSolicitud_controller_ProductosController({
    productossModel
  });

  // Crear solicitud
  router.get('/productoSolicitud/:idSolicitud', productossController.obtenerProductosSolicitud);
  router.get('/mezclasId/:id', productossController.obtenerTablaMezclasId);
  router.post('/productoSoli', productossController.create);
  router.post('/actualizarEstadoProductos', productossController.actulizarEstado);
  router.delete('/eliminarProducto/:id', productossController.EliminarPorducto);
  return router;
};
;// CONCATENATED MODULE: ./src/controller/produccion.controller.js

class ProduccionController {
  constructor({
    produccionModel
  }) {
    this.produccionModel = produccionModel;
  }

  // extraer
  ObtenerGastoUsuario = async (req, res) => {
    try {
      const centroCoste = await this.produccionModel.ObtenerGastoUsuario({
        tipo: req.params.tipo
      });
      if (centroCoste.error) {
        res.status(404).json({
          error: `${centroCoste.error}`
        });
      }
      res.json(centroCoste);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  solicitudReporte = async (req, res) => {
    const {
      user
    } = req.session;
    try {
      const centroCoste = await this.produccionModel.solicitudReporte({
        empresa: user.empresa,
        rol: user.rol,
        idUsuario: user.id
      });
      if (centroCoste.error) {
        res.status(404).json({
          error: `${centroCoste.error}`
        });
      }
      res.json(centroCoste);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarEcxel = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarEcxel({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarSolicitud = asyncHandler(async (req, res) => {
    const buffer = await this.produccionModel.descargarSolicitud({
      datos: req.body
    });
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
    res.send(buffer);
  });
  descargarReporte = asyncHandler(async (req, res) => {
    const buffer = await this.produccionModel.descargarReporte({
      datos: req.body
    });
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
    res.send(buffer);
  });
  descargarReporteV2 = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarReporteV2({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarReportePendientes = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    const {
      empresa
    } = req.params;
    let buffer;
    if (empresa === 'todo') {
      buffer = await this.produccionModel.descargarReportePendientesCompleto();
    } else {
      buffer = await this.produccionModel.descargarReportePendientes({
        empresa: empresa || user.empresa
      });
    }
    // Configurar las cabeceras para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
    res.send(buffer);
  });
  ObtenerReceta = async (req, res) => {
    try {
      const buffer = await this.produccionModel.ObtenerReceta();
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      res.json(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/produccion.routes.js


const createProduccionRouter = ({
  produccionModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const produccionController = new ProduccionController({
    produccionModel
  });
  router.get('/solicitudReporte', produccionController.solicitudReporte);
  router.post('/descargar-excel', produccionController.descargarEcxel);
  router.post('/descargar-solicitud', produccionController.descargarSolicitud); // uso
  router.get('/obetenerReceta', produccionController.ObtenerReceta);
  router.post('/descargarReporte', produccionController.descargarReporte); // uso
  router.post('/descargarReporte-v2', produccionController.descargarReporteV2); // uso
  router.get('/reporte-pendientes', produccionController.descargarReportePendientes); // uso
  router.get('/reporte-pendientes/:empresa', produccionController.descargarReportePendientes); // uso

  return router;
};
;// CONCATENATED MODULE: ./src/controller/notificaciones.controller.js

class NotificacionesController {
  constructor({
    notificacionModel
  }) {
    this.notificacionModel = notificacionModel;
  }

  // uso
  getAllIdUsuario = asyncHandler(async (req, res) => {
    const {
      user
    } = req.session;
    const result = await this.notificacionModel.getAllIdUsuario({
      idUsuario: user.id
    });
    res.json(result);
  });

  // uso
  updateStatus = asyncHandler(async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.notificacionModel.updateStatus({
      id
    });
    return res.json({
      message: result.message
    });
  });
}
;// CONCATENATED MODULE: ./src/routes/notificaciones.routes.js


const createNotificacionesRouter = ({
  notificacionModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const notificacionController = new NotificacionesController({
    notificacionModel
  });

  // Obtener todas las notificaciones
  router.get('/notificaciones', notificacionController.getAllIdUsuario);
  router.put('/notificaciones/:id', notificacionController.updateStatus);
  return router;
};
;// CONCATENATED MODULE: ./src/middlewares/validateFormatoImg.js
const validateImageFile = (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      error: 'No se ha subido ninguna imagen'
    });
  }
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = req.files.image.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      error: 'Formato de archivo no válido. Use: ' + validExtensions.join(', ')
    });
  }
  next();
};
const validateBase64Image = (req, res, next) => {
  const {
    image
  } = req.body;
  if (!image) {
    return res.status(400).json({
      error: 'No se ha enviado ninguna imagen'
    });
  }

  // Verificar que sea una cadena base64 válida
  if (!isValidBase64(image)) {
    return res.status(400).json({
      error: 'La imagen no está en formato base64 válido'
    });
  }

  // Obtener el tipo de archivo desde el base64
  const matches = image.match(/^data:image\/(.*?);base64,/);
  if (!matches) {
    return res.status(400).json({
      error: 'Formato de imagen no válido'
    });
  }
  const fileExtension = matches[1].toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      error: `Formato de archivo no válido. Use: ${validExtensions.join(', ')}`
    });
  }

  // Limitar tamaño (ejemplo: 5MB)
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  const fileSize = Buffer.from(base64Data, 'base64').length;
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (fileSize > maxSize) {
    return res.status(400).json({
      error: 'La imagen excede el tamaño máximo permitido (5MB)'
    });
  }

  // Si todo está bien, continuamos
  next();
};

// Función auxiliar para validar base64
const isValidBase64 = str => {
  if (!str?.startsWith('data:image/')) return false;
  try {
    const base64Data = str.split(',')[1];
    return Buffer.from(base64Data, 'base64').toString('base64') === base64Data;
  } catch (e) {
    return false;
  }
};
;// CONCATENATED MODULE: external "uuid"
var external_uuid_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_uuid_y = (x) => (() => (x))
const external_uuid_namespaceObject = external_uuid_x({ ["v4"]: () => (__WEBPACK_EXTERNAL_MODULE_uuid__.v4) });
;// CONCATENATED MODULE: ./src/controller/uploads.controller.js





class UploadsController {
  agregarImagenes = async (req, res) => {
    try {
      const {
        image
      } = req.body;

      // Extraer extensión y datos
      const matches = image.match(/^data:image\/(.*?);base64,/);
      const fileExtension = matches[1];
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

      // Generar nombre único
      const fileName = `${(0,external_uuid_namespaceObject.v4)()}.${fileExtension}`;
      const filePath = (0,external_path_namespaceObject.join)(process.cwd(), 'uploads', 'images', fileName);

      // Guardar archivo
      await (0,promises_namespaceObject.writeFile)(filePath, base64Data, 'base64');
      res.json({
        message: 'Imagen guardada correctamente',
        fileName,
        path: `/uploads/images/${fileName}`
      });
    } catch (error) {
      throw new CustomError_DatabaseError('Error al guardar imagen');
    }
  };
  obtenerImagenes = async (req, res) => {
    const {
      user
    } = req.session;
    try {
      // Verificar si el usuario está autenticado (el middleware ya lo hace, pero por seguridad extra)
      if (!user) {
        utils_logger.error('Usuario no autenticado');
        throw new CustomError_ValidationError('Usuario no autenticado')();
      }
      const {
        filename
      } = req.params;
      utils_logger.debug('filename', filename);
      const imagePath = (0,external_path_namespaceObject.join)(__dirname, '..', 'uploads', 'images', filename);
      res.sendFile(imagePath, err => {
        if (err) {
          utils_logger.error(`Error al enviar imagen:${err}`);
          throw new CustomError_NotFoundError('Imagen no encontrada');
        }
      });
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al obtener imagen');
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/uploads.routes.js



const createUploadsRouter = () => {
  const router = (0,external_express_namespaceObject.Router)();
  const uploadsController = new UploadsController();

  // agregar Imagenes
  router.post('/images', validateBase64Image, uploadsController.agregarImagenes);

  // obtener imagenes
  router.get('/images/:filename', uploadsController.obtenerImagenes);
  return router;
};
;// CONCATENATED MODULE: external "exceljs"
var external_exceljs_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_exceljs_y = (x) => (() => (x))
const external_exceljs_namespaceObject = external_exceljs_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_exceljs__["default"]) });
;// CONCATENATED MODULE: ./src/config/excel.js




// utils


async function obtenerProductosPorSolicitud(idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const productos = await SolicitudRecetaModel.obtenerProductosSolicitud({
      idSolicitud
    });

    // Verificamos que se hayan obtenido datos
    if (!productos || productos.length === 0) {
      throw new CustomError_NotFoundError(`No se encontraron productos para la solicitud ${idSolicitud}`);
    }
    return productos.map(producto => ({
      id_sap: producto.id_sap,
      // Asegúrate de que este campo existe en tu modelo
      nombre: producto.nombre_producto,
      // Asegúrate de que este campo existe en tu modelo
      unidad_medida: producto.unidad_medida,
      cantidad: producto.cantidad
    }));
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al obtener productos para la solicitud');
  }
}
async function obtenerVariedades(idSolicitud) {
  try {
    const variedades = await MezclaModel.obtenerPorcentajes({
      id: idSolicitud
    });
    // Verificamos que se hayan obtenido datos
    if (!variedades || variedades.length === 0) {
      throw new CustomError_NotFoundError(`No se encontraron variedades para la solicitud ${idSolicitud}`);
    }
    if (variedades && variedades.length > 0) {
      return variedades.map(variedad => ({
        variedad: variedad.variedad,
        // Asegúrate de que este campo existe en tu modelo
        porcentajes: variedad.porcentajes
      }));
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return [];
    }
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al obtener variedades para la solicitud');
  }
}
async function obtenerPorcentajes(id) {
  try {
    // Asumiendo que este método existe en tu modelo
    const variedades = await MezclaModel.obtenerPorcentajes({
      id
    });
    // Verificamos que se hayan obtenido datos
    if (!variedades || variedades.length === 0) {
      throw new CustomError_NotFoundError(`No se encontraron variedades para el centro de coste ${id}`);
    }
    return variedades;
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al obtener variedades para el centro de coste');
  }
}
async function obtenerDatosSolicitud(idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const solicitudes = await MezclaModel.obtenerDatosSolicitud({
      id: idSolicitud
    });
    utils_logger.debug('solicitudes', solicitudes);
    // Verificamos que se hayan obtenido datos
    if (!solicitudes || solicitudes.length === 0) {
      throw new CustomError_NotFoundError(`No se encontraron datos para la solicitud ${idSolicitud}`);
    }
    // Verificar si se obtuvieron solicitudes
    if (solicitudes && solicitudes.length > 0) {
      return solicitudes.map(solicitud => ({
        cantidad: solicitud.cantidad,
        // Asegúrate de que este campo existe en tu modelo
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion
      }));
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return [];
    }
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al obtener datos para la solicitud');
  }
}
const crearExcel = async parametros => {
  try {
    // preparacion de estilos
    const font = {
      name: 'Arial',
      size: 12,
      bold: true,
      italic: false
    };

    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new CustomError_NotFoundError('No hay datos para generar el Excel');
    }

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Crear hoja principal con los datos de DataTable
    const hojaGeneral = workbook.addWorksheet('Datos Generales');
    hojaGeneral.columns = []; // Espacio vacío
    hojaGeneral.addRow([]); // Espacio vacío entre las tablas

    hojaGeneral.columns = [{
      header: 'ID Solicitud',
      key: 'id_solicitud',
      width: 15
    }, {
      header: 'Solicita',
      key: 'usuario',
      width: 15
    }, {
      header: 'Fecha Solicitud',
      key: 'fechaSolicitud',
      width: 15
    }, {
      header: 'Fecha Cierre',
      key: 'fechaCierre',
      width: 15
    }, {
      header: 'Empresa',
      key: 'empresa',
      width: 20
    }, {
      header: 'Rancho',
      key: 'rancho',
      width: 20
    }, {
      header: 'Temporada',
      key: 'temporada',
      width: 20
    }, {
      header: 'Folio de Receta',
      key: 'folio',
      width: 20
    }, {
      header: 'Centro de Coste',
      key: 'centroCoste',
      width: 20
    }, {
      header: 'Variedad Fruta',
      key: 'variedad',
      width: 20
    }];

    // Agregar datos filtrados a la hoja principal
    datos.forEach(dato => {
      hojaGeneral.addRow({
        id_solicitud: dato.id_solicitud,
        usuario: dato.usuario,
        fechaSolicitud: dato.fechaSolicitud,
        fechaCierre: dato.fechaEntrega,
        empresa: dato.empresa,
        rancho: dato.rancho,
        temporada: dato.temporada,
        folio: dato.folio,
        centroCoste: dato.centroCoste || dato.centro_coste,
        variedad: dato.variedad
      });
    });

    // Procesar cada solicitud para crear hojas personalizadas
    for (const solicitud of datos) {
      const idSolicitud = solicitud.id_solicitud || solicitud.idSolicitud;
      const usuario = solicitud.usuario;
      const fechaSolicitud = solicitud.fechaSolicitud;
      const empresa = solicitud.empresa;
      const rancho = solicitud.rancho;
      const temporada = solicitud.temporada;
      const folio = solicitud.folio;
      const centroCoste = solicitud.centroCoste || solicitud.centro_coste;
      const variedad = solicitud.variedad;
      try {
        // Consultar productos relacionados en la base de datos
        const productos = await obtenerProductosPorSolicitud(idSolicitud);

        // Crear una hoja para esta solicitud
        const hojaSolicitud = workbook.addWorksheet(`Solicitud ${idSolicitud}`);
        hojaSolicitud.addRow([`Datos de la solicitud ${idSolicitud}`]); // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A1').font = font;

        // Agregar información de la solicitud en la primera tabla
        hojaSolicitud.addRow(['ID Solicitud', idSolicitud]);
        hojaSolicitud.addRow(['Solicita', usuario]);
        hojaSolicitud.addRow(['Fecha Solicitud', fechaSolicitud]);
        hojaSolicitud.addRow(['Empresa', empresa]);
        hojaSolicitud.addRow(['Rancho', rancho]);
        hojaSolicitud.addRow(['Temporada', temporada]);
        hojaSolicitud.addRow(['Folio de Receta', folio]);
        hojaSolicitud.addRow(['Centro de Coste', centroCoste]);
        hojaSolicitud.addRow(['Variedad Fruta', variedad]);
        hojaSolicitud.addRow([]); // Espacio vacío

        // Agregar encabezados para los productos en la segunda tabla
        hojaSolicitud.addRow(['Datos de los productos solicitados']); // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A12').font = font;
        hojaSolicitud.addRow(['id_sap', 'Producto', 'Unidad Medida', 'Cantidad Solicitada']); // Encabezados de la segunda tabla

        // Agregar productos a la hoja
        if (productos && productos.length > 0) {
          for (let i = 0; i < productos.length; i++) {
            hojaSolicitud.addRow([productos[i].id_sap, productos[i].nombre, productos[i].unidad_medida, productos[i].cantidad]);
          }
        } else {
          utils_logger.error({
            message: 'No se encontraron productos o la estructura es incorrecta',
            error: 'No se encontraron productos o la estructura es incorrecta'
          });
        }

        // Ajustar el ancho de las columnas
        hojaSolicitud.columns.forEach(column => {
          const maxLength = column.values.reduce((max, value) => {
            return Math.max(max, value ? value.toString().length : 0);
          }, 0);
          column.width = maxLength + 2; // Añadir un poco de espacio extra
        });
      } catch (error) {
        console.error(`Error al procesar solicitud ${idSolicitud}:`, error);
        const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`);
        hojaError.addRow(['Error al obtener productos para esta solicitud.']);
      }
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al procesar datos para el reporte');
  }
};
const crearSolicitudV2 = async parametros => {
  try {
    if (!parametros || parametros.length === 0) {
      throw new ValidationError('No se encontraron datos para la solicitud');
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Estilo de encabezados

    const idSolicitud = parametros.id_solicitud;
    const folio = parametros.folio;
    const usuario = parametros.solicita;
    const fechaSolicitud = parametros.fecha_solicitud;
    const rancho = parametros.rancho_destino;
    const centroCoste = parametros.centro_coste;
    const variedad = parametros.variedad;
    const empresa = parametros.empresa;
    const temporada = parametros.temporada;
    const cantidad = parametros.cantidad;
    const presentacion = parametros.presentacion;
    const metodoAplicacion = parametros.metodo_aplicacion;
    const descripcion = parametros.descripcion;
    try {
      // Consultar productos relacionados en la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud);
      const font = {
        name: 'Arial',
        size: 12,
        bold: true,
        italic: false
      };
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet(`Solicitud ${idSolicitud}`);
      hojaGeneral.addRow([`Datos de la solicitud ${idSolicitud}`]); // Encabezados de la segunda tabla
      hojaGeneral.getCell('A1').font = font;

      // Agregar información de la solicitud en la primera tabla
      hojaGeneral.addRow(['ID Solicitud', idSolicitud]);
      hojaGeneral.addRow(['Folio de Receta', folio]);
      hojaGeneral.addRow(['Solicita', usuario]);
      hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]);
      hojaGeneral.addRow(['Rancho', rancho]);
      hojaGeneral.addRow(['Centro de Coste', centroCoste]);
      hojaGeneral.addRow(['Variedad Fruta', variedad]);
      hojaGeneral.addRow(['Empresa', empresa]);
      hojaGeneral.addRow(['Temporada', temporada]);
      hojaGeneral.addRow(['Cantidad de Mezcla', cantidad]);
      hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion]);
      hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]);
      hojaGeneral.addRow(['Descripcion', descripcion]);
      hojaGeneral.addRow([]); // Espacio vacío

      // Agregar encabezados para los productos en la segunda tabla
      hojaGeneral.addRow(['Datos de los productos solicitados']); // Encabezados de la segunda tabla
      hojaGeneral.getCell('A16').font = font;
      hojaGeneral.addRow(['id_sap', 'Producto', 'Unidad Medida', 'Cantidad Solicitada']); // Encabezados de la segunda tabla

      // Agregar productos a la hoja
      if (productos && productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
          hojaGeneral.addRow([productos[i].id_sap, productos[i].nombre, productos[i].unidad_medida, productos[i].cantidad]);
        }
      } else {
        logger.info('No se encontraron productos o la estructura es incorrecta');
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`);
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
      // Manejo de errores
      if (error instanceof CustomError) throw error;
      throw new DatabaseError('Error al procesar datos para el reporte');
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new DatabaseError('Error al procesar datos para el reporte');
  }
};
// Crear Reporte Solicitud
const reporteSolicitud = async parametros => {
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  let filtrados = [];
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];

    // console.log('Datos a procesar:', datos)

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new NotFoundError('No hay datos para generar el Excel');
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Cabecera de la tabla
    let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];
    let porcentaje = ['', '', ''];
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales');
      // obtenemos datos de la variedad
      for (const dato of datos) {
        if (dato.variedad.split(',').length > 1) {
          // Obtener variedades
          variedades = await obtenerVariedades(dato.id);
          // console.log('Variedades obtenidas:', variedades)

          // Agregar nombres de variedades a la cabecera
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const variedadSplit = variedad.variedad.split(',');
              const porcentajeSplit = variedad.porcentajes.split(',');
              // Filtrar ambos arrays en paralelo
              filtrados = variedadSplit.reduce((acc, variedad, index) => {
                if (parseInt(porcentajeSplit[index].trim()) !== 0) {
                  acc.variedades.push(variedad);
                  acc.porcentajes.push(porcentajeSplit[index]);
                }
                return acc;
              }, {
                variedades: [],
                porcentajes: []
              });
              for (const item of filtrados.variedades) {
                if (!cabecera.includes(item)) {
                  cabecera.push(item);
                }
              }
              for (const item of porcentajeSplit) {
                if (!porcentaje.includes(item)) {
                  porcentaje.push(item);
                }
              }
            }
          }
        } else {
          cabecera.push(dato.variedad);
        }
        if (dato.variedad.split(',').length > 1) {
          hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell(cell => {
            cell.style = headerStyle;
          }); // Encabezado de la hoja

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.id_solicitud : dato.id]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : filtrados.variedades]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell(cell => {
            cell.style = cellStyle;
          });
        } else {
          hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell(cell => {
            cell.style = headerStyle;
          }); // Encabezado de la hoja

          // obtenemos datos faltantes de la solicitud
          const datosF = await obtenerDatosSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id);
          // console.log('Datos de la solicitud:', datosF)

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.idSolicitud : dato.id]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Folio de Receta', dato.folio ? dato.folio : dato.FolioReceta]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Solicita', dato.usuario ? dato.usuario : dato.Solicita]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega ? dato.fechaEntrega : 'No aplica']).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Rancho', dato.rancho ? dato.rancho : dato.ranchoDestino]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : filtrados.variedades]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Cantidad de Mezcla', datosF[0].cantidad]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Presentacion de la Mezcla', datosF[0].presentacion]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Metodo de aplicacion', datosF[0].metodoAplicacion]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell(cell => {
            cell.style = cellStyle;
          });
        }
        // Agregar información de la solicitud
        hojaGeneral.addRow([]); // Espacio vacío con estilo

        // Agregar la cabecera a la hoja
        hojaGeneral.addRow(porcentaje);
        hojaGeneral.addRow(cabecera).eachCell(cell => {
          cell.style = headerStyle;
        });
        // limpiamos cabeceras
        cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];
        porcentaje = ['', '', ''];

        // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id);
        // console.log('Productos obtenidos:', productos)

        // Crear el arreglo de datos
        const data = [];
        if (productos && productos.length > 0) {
          for (const producto of productos) {
            const fila = [producto.id_sap, producto.nombre, producto.unidad_medida, producto.cantidad];

            // Calcular porcentajes de variedades
            if (dato.variedad.split(',').length > 1) {
              if (variedades && variedades.length > 0) {
                for (const variedad of filtrados) {
                  const variedadSplit = variedad.porcentajes.split(',');
                  for (const item of variedadSplit) {
                    const porcentajeVariedad = producto.cantidad * item / 100;
                    fila.push(porcentajeVariedad);
                  }
                }
              }
            } else {
              fila.push(producto.cantidad);
            }
            data.push(fila);
          }
        } else {
          logger.info('No se encontraron productos o la estructura es incorrecta');
        }

        // Agregar los datos a la hoja
        data.forEach(row => {
          hojaGeneral.addRow(row).eachCell(cell => {
            cell.style = cellStyle;
          });
        });

        // Agregar un separador entre solicitudes
        hojaGeneral.addRow([]);
        hojaGeneral.addRow([]);
        hojaGeneral.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell(cell => {
          cell.border = {
            top: {
              style: 'thick',
              color: {
                argb: '00000000'
              }
            },
            bottom: {
              style: 'thick',
              color: {
                argb: '00000000'
              }
            }
          };
        });
        hojaGeneral.addRow([]);
        hojaGeneral.addRow([]);
        // Agregar un separador entre solicitudes
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
      logger.error({
        message: 'Error al procesar solicitud',
        error: error.message,
        stack: error.stack,
        method: 'reporteSolicitudv3'
      });
      if (error instanceof CustomError) throw error;
      throw new DatabaseError('Error al procesar datos para el reporte');
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new DatabaseError('Error al procesar datos para el reporte');
  }
};
const reporteSolicitudV2 = async parametros => {
  // console.log(parametros)
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  const dataMescla = [];
  // const dataFertilizante = []
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];

    // console.log('Datos a procesar:', datos)

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Cabecera de la tabla mezclas
    const cabeceraMezclas = ['Id Solicitud', 'Folio de Receta', 'Solicita', 'Fecha Solicitud', 'Fecha Entrega', 'Rancho', 'Centro de Coste', 'Empresa', 'Temporada', 'Variedad Fruta', 'Cantidad de Mezcla', 'Presentacion de la Mezcla', 'Metodo de aplicacion', 'id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada', 'Porcentaje Correspondiente', 'Cantidad Correspondiente'];
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales');
      hojaGeneral.addRow(cabeceraMezclas).eachCell(cell => {
        cell.style = headerStyle;
      });

      // obtenemos datos de la variedad
      for (const dato of datos) {
        // // obtenemos datos faltantes de la solicitud
        const datosF = await obtenerDatosSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id);
        // console.log('Datos de la solicitud:', datosF)

        // // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id);
        // console.log('Productos obtenidos:', productos)
        // Crear el arreglo de datos
        if (dato.variedad.split(',').length > 1) {
          variedades = await obtenerPorcentajes(dato.id_solicitud ? dato.id_solicitud : dato.id);
          // console.log('Variedades obtenidas:', variedades)
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const porcentajeSplit = variedad.dataValues.porcentajes.split(',');
              const variedadSplit = dato.variedad.split(',');
              for (let i = 0; i < variedadSplit.length; i++) {
                if (productos && productos.length > 0) {
                  for (const producto of productos) {
                    const fila = [dato.id_solicitud, dato.folio ? dato.folio : 'No aplica', dato.usuario, dato.fechaSolicitud, dato.fechaEntrega, dato.rancho, dato.centroCoste, dato.empresa, dato.temporada, variedadSplit[i], datosF[0].cantidad ? datosF[0].cantidad : 'No aplica', datosF[0].presentacion ? datosF[0].presentacion : 'No aplica', datosF[0].metodoAplicacion, producto.id_sap, producto.nombre, producto.unidad_medida, producto.cantidad, '%' + porcentajeSplit[i], producto.cantidad * porcentajeSplit[i] / 100];
                    dataMescla.push(fila);
                  }
                } else {
                  console.error('No se encontraron productos o la estructura es incorrecta');
                }
              }
            }
          } else {
            console.error('No se encontraron productos o la estructura es incorrecta');
          }
        } else {
          for (const producto of productos) {
            const fila = [dato.id_solicitud, dato.folio ? dato.folio : 'No aplica', dato.usuario, dato.fechaSolicitud, dato.fechaEntrega, dato.rancho, dato.centroCoste, dato.empresa, dato.temporada, dato.variedad, datosF[0].cantidad ? datosF[0].cantidad : 'No aplica', datosF[0].presentacion ? datosF[0].presentacion : 'No aplica', datosF[0].metodoAplicacion, producto.id_sap, producto.nombre, producto.unidad_medida, producto.cantidad, '% 100', producto.cantidad];
            dataMescla.push(fila);
          }
        }
      }
      // Agregar los datos a la hoja de mezclas
      dataMescla.forEach(row => {
        hojaGeneral.addRow(row).eachCell(cell => {
          cell.style = cellStyle;
        });
      });
      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
const crearSolicitud = async parametros => {
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  let filtrados;
  try {
    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Cabecera de la tabla
    let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];

    // preparamos datos
    const idSolicitud = parametros.id_solicitud;
    const folio = parametros.folio;
    const usuario = parametros.solicita;
    const fechaSolicitud = parametros.fecha_solicitud;
    const rancho = parametros.rancho_destino;
    const centroCoste = parametros.centro_coste;
    const variedad = parametros.variedad;
    const empresa = parametros.empresa;
    const temporada = parametros.temporada;
    const cantidad = parametros.cantidad;
    const presentacion = parametros.presentacion;
    const metodoAplicacion = parametros.metodo_aplicacion;
    const descripcion = parametros.descripcion;
    const varie = variedad.split(',');
    // console.log(varie)
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales');

      // Modificación del manejo de variedades múltiples
      if (varie.length > 1) {
        variedades = await obtenerPorcentajes(idSolicitud);
        if (variedades && variedades.length > 0) {
          // Arrays para almacenar todas las variedades y porcentajes únicos
          const todasVariedades = [];
          const todosPorcentajes = [];

          // Primero recolectamos todas las variedades y porcentajes
          variedades.forEach(variedad => {
            const variedadSplit = varie;
            const porcentajeSplit = variedad.dataValues.porcentajes.split(',');
            // Filtrar ambos arrays en paralelo
            filtrados = variedadSplit.reduce((acc, variedad, index) => {
              if (parseInt(porcentajeSplit[index].trim()) !== 0) {
                acc.variedades.push(variedad);
                acc.porcentajes.push(porcentajeSplit[index]);
              }
              return acc;
            }, {
              variedades: [],
              porcentajes: []
            });
            filtrados.variedades.forEach((v, index) => {
              if (!todasVariedades.includes(v)) {
                todasVariedades.push(v + ' ' + '%' + filtrados.porcentajes[index]);
                todosPorcentajes.push(porcentajeSplit[index]);
              }
            });
          });

          // Ahora agregamos a las cabeceras
          todasVariedades.forEach(v => {
            if (!cabecera.includes(v)) {
              cabecera.push(v);
            }
          });
        }
      } else {
        cabecera.push(variedad);
      }
      hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell(cell => {
        cell.style = headerStyle;
      }); // Encabezado de la hoja

      hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Folio de Receta', folio === '' ? 'No aplica' : folio]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Solicita', usuario]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Rancho', rancho]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Variedad Fruta', variedad]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Empresa', empresa]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Temporada', temporada]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Cantidad de Mezcla', cantidad === '' ? 'No aplica' : cantidad]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion === '' ? 'No aplica' : presentacion]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]).eachCell(cell => {
        cell.style = cellStyle;
      });
      hojaGeneral.addRow(['Descripcion', descripcion]).eachCell(cell => {
        cell.style = cellStyle;
      });

      // Agregar información de la solicitud
      hojaGeneral.addRow([]); // Espacio vacío con estilo

      // Agregar la cabecera a la hoja

      hojaGeneral.addRow(cabecera).eachCell(cell => {
        cell.style = headerStyle;
      });
      // limpiamos cabeceras
      cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];

      // Obtener productos de la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud);

      // Crear el arreglo de datos
      const data = [];
      if (productos && productos.length > 0) {
        productos.forEach(producto => {
          const fila = [producto.id_sap, producto.nombre, producto.unidad_medida, producto.cantidad];
          if (varie.length > 1 && variedades && variedades.length > 0) {
            // Agregamos un valor para cada variedad
            filtrados.porcentajes.forEach(porcentaje => {
              const cantidadPorcentaje = producto.cantidad * parseFloat(porcentaje) / 100;
              fila.push(Number(cantidadPorcentaje.toFixed(2))); // Redondear a 2 decimales
            });
          } else {
            fila.push(producto.cantidad);
          }
          data.push(fila);
        });
      } else {
        utils_logger.info('No se encontraron productos o la estructura es incorrecta');
      }

      // Agregar los datos a la hoja
      data.forEach(row => {
        hojaGeneral.addRow(row).eachCell(cell => {
          cell.style = cellStyle;
        });
      });

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
      // Manejo de errores
      utils_logger.error({
        message: 'Error al procesar solicitud',
        error: error.message,
        stack: error.stack,
        method: 'reporteSolicitudV2'
      });
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar datos para el reporte');
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};

// Extraer estilos a un objeto de configuración
const EXCEL_STYLES = {
  header: {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  },
  cell: {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  }
};

// Separar la lógica de procesamiento de datos
const procesarDatosSolicitud = async dato => {
  const idSolicitud = dato.id_solicitud || dato.id;
  const productos = await obtenerProductosPorSolicitud(idSolicitud);
  if (!productos?.length) {
    throw new CustomError_NotFoundError('No se encontraron productos para la solicitud');
  }

  // Procesar variedades si es necesario
  let variedadesInfo = null;
  if (dato.variedad.split(',').length > 1) {
    variedadesInfo = await procesarVariedades(idSolicitud);
  }
  return {
    productos,
    variedadesInfo,
    datosSolicitud: await obtenerDatosSolicitud(idSolicitud)
  };
};

// Separar la generación de filas
const generarFilasProductos = (productos, variedadesInfo) => {
  return productos.map(producto => {
    const fila = [producto.id_sap, producto.nombre, producto.unidad_medida, producto.cantidad];
    if (variedadesInfo) {
      variedadesInfo.porcentajes.forEach(porcentaje => {
        const cantidad = producto.cantidad * parseFloat(porcentaje) / 100;
        fila.push(Number(cantidad.toFixed(2)));
      });
    } else {
      fila.push(producto.cantidad);
    }
    return fila;
  });
};
const procesarVariedades = async idSolicitud => {
  const variedades = await obtenerVariedades(idSolicitud);
  if (!variedades?.length) {
    throw new CustomError_NotFoundError('No se encontraron variedades para el centro de coste');
  }

  // Convertir a array, eliminar último elemento y volver a string
  const variedadesArray = variedades[0].variedad.split(',');
  const porcentajesArray = variedades[0].porcentajes.split(',');

  // Filtrar ambos arrays en paralelo
  const filtrados = variedadesArray.reduce((acc, variedad, index) => {
    if (parseInt(porcentajesArray[index].trim()) !== 0) {
      acc.variedades.push(variedad);
      acc.porcentajes.push(porcentajesArray[index]);
    }
    return acc;
  }, {
    variedades: [],
    porcentajes: []
  });
  return filtrados;
};

// Agregar encabezados a la hoja
const agregarEncabezadoSolicitud = async (hojaGeneral, dato, datosSolicitud, variedadesInfo) => {
  // Agregar encabezados
  hojaGeneral.addRow(['Datos Generales']).eachCell(cell => {
    cell.style = EXCEL_STYLES.header;
  });

  // Cabecera de la tabla
  let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];
  let porcentaje = ['', '', ''];
  const todasVariedades = [];

  // obtenemos datos faltantes de la solicitud
  if (dato.variedad.split(',').length > 1) {
    // Filtrar ambos arrays en paralelo
    variedadesInfo.variedades.forEach((v, index) => {
      if (!todasVariedades.includes(v)) {
        todasVariedades.push(v + ' ' + '%' + variedadesInfo.porcentajes[index]);
      }
    });
  } else {
    cabecera.push(dato.variedad);
  }
  // Ahora agregamos a las cabeceras
  todasVariedades.forEach(v => {
    if (!cabecera.includes(v)) {
      cabecera.push(v);
    }
  });
  hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.id_solicitud : dato.id]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Folio de Receta', dato.FolioReceta === '' || dato.folio === '' ? 'No aplica' : dato.FolioReceta || dato.folio]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Solicita', dato.usuario ? dato.usuario : dato.Solicita]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega ? dato.fechaEntrega : 'No aplica']).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Rancho', dato.rancho ? dato.rancho : dato.ranchoDestino]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Variedad Fruta', dato.variedad]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Cantidad de Mezcla', datosSolicitud[0].cantidad === '' ? 'No aplica' : datosSolicitud[0].cantidad]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Presentacion de la Mezcla', datosSolicitud[0].cantidad === '' ? 'No aplica' : datosSolicitud[0].cantidad]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Metodo de aplicacion', datosSolicitud[0].metodoAplicacion]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });
  hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell(cell => {
    cell.style = EXCEL_STYLES.cell;
  });

  // Agregar información de la solicitud
  hojaGeneral.addRow([]); // Espacio vacío con estilo

  // Agregar la cabecera a la hoja
  hojaGeneral.addRow(porcentaje);
  hojaGeneral.addRow(cabecera).eachCell(cell => {
    cell.style = EXCEL_STYLES.header;
  });
  // limpiamos cabeceras
  cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada'];
  porcentaje = ['', '', ''];
};
const agregarFilasProductos = (hojaGeneral, filas) => {
  filas.forEach(fila => {
    hojaGeneral.addRow(fila).eachCell(cell => {
      cell.style = EXCEL_STYLES.cell;
    });
  });
};
const agregarSeparador = hojaGeneral => {
  hojaGeneral.addRow([]);
  hojaGeneral.addRow([]);
  hojaGeneral.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell(cell => {
    cell.border = {
      top: {
        style: 'thick',
        color: {
          argb: '00000000'
        }
      },
      bottom: {
        style: 'thick',
        color: {
          argb: '00000000'
        }
      }
    };
  });
  hojaGeneral.addRow([]);
  hojaGeneral.addRow([]);
};
const ajustarColumnasExcel = hojaGeneral => {
  hojaGeneral.columns.forEach(column => {
    const maxLength = column.values.reduce((max, value) => {
      return Math.max(max, value ? value.toString().length : 0);
    }, 0);
    column.width = maxLength + 2; // Añadir un poco de espacio extra
  });
};
// uso
const reporteSolicitudv3 = async parametros => {
  try {
    utils_logger.debug('reporteSolicitudv3', parametros);
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];
    if (!datos.length) throw new CustomError_NotFoundError('No hay datos para generar el Excel');
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();
    const hojaGeneral = workbook.addWorksheet('Datos Generales');
    for (const dato of datos) {
      try {
        const {
          productos,
          variedadesInfo,
          datosSolicitud
        } = await procesarDatosSolicitud(dato);

        // Agregar encabezados
        agregarEncabezadoSolicitud(hojaGeneral, dato, datosSolicitud, variedadesInfo);

        // Agregar productos
        const filas = generarFilasProductos(productos, variedadesInfo);
        // console.table(filas)
        agregarFilasProductos(hojaGeneral, filas);

        // Agregar separador
        agregarSeparador(hojaGeneral);
      } catch (error) {
        utils_logger.error(`Error procesando solicitud ${dato.id_solicitud || dato.id}:`, error);
        continue; // Continuar con la siguiente solicitud
      }
    }
    ajustarColumnasExcel(hojaGeneral);
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    if (error instanceof CustomError_CustomError) throw error;
    throw new CustomError_DatabaseError('Error al procesar datos para el reporte');
  }
};
;// CONCATENATED MODULE: ./src/models/produccion.models.js



// utils


class ProduccionModel {
  static async ObtenerGastoUsuario({
    tipo
  }) {
    // comprobar que el objeto tipo tenga alguno de los siguientes datos Usuario,temporada, empresa entre otros antes de proceder a la consulta
    const permitidos = ['usuario', 'temporada', 'empresa', 'centroCoste', 'rancho', 'variedad'];
    const valido = permitidos.includes(tipo);
    try {
      if (valido) {
        const data = await db.query(`SELECT ${tipo} , SUM(precio_cantidad) AS precio_cantidad FROM vista_solicitudes GROUP BY ${tipo}`);
        // Verifica si hay duplicados
        const uniqueData = Array.from(new Map(data.map(item => [valido, item])).values());
        // Si llegamos aquí, la ejecución fue exitosa
        return uniqueData;
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async solicitudReporte({
    empresa,
    rol,
    idUsuario
  }) {
    let data;
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!empresa || !rol || !idUsuario) {
        throw new CustomError_ValidationError('Datos requeridos no proporcionados');
      }
      if (rol === 'admin') {
        data = await db.query('SELECT * FROM total_precio_cantidad_solicitud');
      } else if (rol === 'administrativo' && empresa === 'General') {
        data = await db.query('SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`!="Lugar Agricola"');
      } else if (rol === 'administrativo' && idUsuario === 33) {
        // admin de Bioagricultura id usuario 33 de francisco alvarez
        data = await db.query('SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`="Bioagricultura" OR `empresa`="Moras Finas"');
      } else if (rol === 'administrativo' && idUsuario === 49) {
        // admin de general id usuario 49 de janet medina
        data = await db.query('SELECT * FROM `total_precio_cantidad_solicitud`"');
      } else {
        data = await db.query(`SELECT * FROM total_precio_cantidad_solicitud WHERE empresa="${empresa}"`);
      }
      // Verificamos que se hayan obtenido datos
      if (!data || data.length === 0) {
        throw new CustomError_NotFoundError('No se encontraron datos para el usuario solicitante');
      }
      // Verifica si hay duplicados
      const uniqueData = Array.from(new Map(data.map(item => [item.id_solicitud, item])).values());
      return uniqueData;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar datos de solicitudes');
    }
  }
  static async descargarEcxel({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new CustomError_ValidationError('datos invalidos, se requiere un arreglo de datos filtrados.');
      }
      const excel = await crearExcel(datos);
      return excel;
    } catch (error) {
      utils_logger.error({
        message: 'Error al procesar producto',
        error: error.message,
        stack: error.stack,
        method: 'ProduccionModel.descargarEcxel'
      });
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar datos de solicitudes');
    }
  }
  static async descargarSolicitud({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new CustomError_ValidationError('datos invalidos, se requiere un arreglo de datos.');
      }
      const excel = await crearSolicitud(datos);
      return excel;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw new CustomError_DatabaseError('Error al procesar datos para el reporte');
    }
  }

  // uso
  static async descargarReporte({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new CustomError_ValidationError('Datos invalidos, se requiere un arreglo de datos.');
      }
      const excel = await reporteSolicitudv3(datos);
      return excel;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw error;
    }
  }
  static async descargarReporteV2({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new CustomError_ValidationError('Datos invalidos, se requiere un arreglo de datos.');
      }
      const excel = await reporteSolicitudV2(datos);
      return excel;
    } catch (error) {
      utils_logger.error({
        message: 'Error al procesar producto',
        error: error.message,
        stack: error.stack,
        method: 'ProduccionModel.descargarReporteV2'
      });
      if (error instanceof CustomError_CustomError) throw error;
      throw error;
    }
  }

  // uso
  static async descargarReportePendientes({
    empresa
  }) {
    try {
      if (!empresa) {
        throw new CustomError_ValidationError('Se requiere especificar una empresa');
      }
      const datos = await MezclaModel.obtenerTablaMezclasEmpresa({
        status: 'Pendiente',
        empresa
      });

      // Validar que hay datos para procesar
      if (!datos) {
        throw new CustomError_NotFoundError('No se encontraron datos para esta empresa');
      }
      const excel = await reporteSolicitudv3(datos);
      return excel;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw error;
    }
  }

  // uso
  static async descargarReportePendientesCompleto() {
    try {
      const datos = await MezclaModel.getAllGeneral({
        status: 'Pendiente'
      });
      // Validar que hay datos para procesar
      if (!datos) {
        throw new CustomError_NotFoundError('No se encontraron datos para esta empresa');
      }
      const excel = await reporteSolicitudv3(datos.data);
      return excel;
    } catch (error) {
      if (error instanceof CustomError_CustomError) throw error;
      throw error;
    }
  }
  static async ObtenerGasto({
    data
  }) {
    try {
      // Llamar al procedimiento almacenado
      await db.query('CALL sp_calcular_precio_solicitud(:idSolicitud, :idProducto, :unidadMedida, :cantidad)', {
        replacements: {
          idSolicitud: data.idSolicitud,
          idProducto: data.producto,
          unidadMedida: data.unidadMedida,
          cantidad: data.cantidad
        },
        type: db.QueryTypes.RAW
      });

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: 'Producto procesado exitosamente'
      };
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async ObtenerReceta() {
    try {
      const data = await db.query('SELECT * FROM vista_recetas_costos');
      const uniqueData = Array.from(new Map(data.map(item => [item.id_receta, item])).values());
      // Si llegamos aquí, la ejecución fue exitosa
      return uniqueData;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
} // fin modelo
;// CONCATENATED MODULE: ./src/models/modelAssociations.js
// models/modelAssociations.js






// logger

function setupAssociations() {
  // Asociaciones para Solicitud
  Solicitud.belongsTo(Usuario, {
    foreignKey: 'idUsuarioSolicita'
  });

  // Solicitud.belongsTo(Usuario, {
  //   foreignKey: 'idUsuarioMezcla'
  // })

  Solicitud.belongsTo(Centrocoste, {
    foreignKey: 'idCentroCoste'
  });

  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Productos, {
    foreignKey: 'id_producto'
  });
  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Recetas, {
    foreignKey: 'id_receta'
  });
  utils_logger.info('✔ Asociaciones configuradas correctamente');
}
;// CONCATENATED MODULE: ./src/server/server.mjs










// Librerias


// Configuraciones


// middlewares






// Rutas
 // protegidas









// Models








// Asociaciones


// Base de datos

const startServer = async options => {
  const {
    PORT,
    MODE
  } = options;
  const app = (0,external_express_namespaceObject["default"])();
  const __filename = (0,external_url_namespaceObject.fileURLToPath)("file:///C:/Users/ZARAGOZA051/Desktop/LGZ2024/src/server/server.mjs");
  const __dirname = (0,external_path_namespaceObject.dirname)(__filename);

  // Configura el directorio de uploads
  const uploadsDir = (0,external_path_namespaceObject.resolve)(__dirname, '..', 'uploads');
  const imagesDir = (0,external_path_namespaceObject.resolve)(uploadsDir, 'images');

  // MOTOR DE PLANTILLAS EJS
  app.set('views', (0,external_path_namespaceObject.resolve)(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');
  app.set('trust proxy', 1);

  // Middlewares
  if (MODE === 'development') {
    utils_logger.info('🔧 Modo de desarrollo');
    // console.log('🔧 Modo de desarrollo')
    // app.use(logger('dev'))
  } else {
    utils_logger.info('📦 Modo de producción');
    // console.log('📦 Modo de producción')
    // app.use(logger('combined'))
  }
  app.use((0,external_compression_namespaceObject["default"])({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return external_compression_namespaceObject["default"].filter(req, res);
    },
    level: 6 // nivel de compresión (0-9)
  }));

  // Configuración de seguridad para permitir recursos externos mientras se mantiene la seguridad básica
  if (MODE !== 'development') {
    utils_logger.info('🔒 helmet configurado');
    app.use((0,external_helmet_namespaceObject["default"])({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://ka-f.fontawesome.com', 'http://localhost:3000'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://ka-f.fontawesome.com'],
          fontSrc: ["'self'", 'https://ka-f.fontawesome.com', 'data:'],
          connectSrc: ["'self'", 'https://ka-f.fontawesome.com', 'http://localhost:3000'],
          imgSrc: ["'self'", 'data:', 'https:'],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    }));
  }
  // Configurar middleware para cookies y validar JSON en los request
  app.use((0,external_cookie_parser_namespaceObject["default"])());
  app.use(validateJSON);
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use((0,external_express_fileupload_namespaceObject["default"])());
  app.use(external_body_parser_namespaceObject["default"].json({
    limit: '50mb'
  }));
  app.use(external_body_parser_namespaceObject["default"].urlencoded({
    limit: '50mb',
    extended: true
  }));
  if (MODE !== 'development') {
    utils_logger.info('🔒 limite de peticiones por IP Activado');
    app.use(apiLimiter); // Limitar el número de peticiones por IP
  }

  // Validar que la documentación está disponible solo en desarrollo
  if (MODE === 'development') {
    app.use('/api-docs', external_swagger_ui_express_namespaceObject["default"].serve, external_swagger_ui_express_namespaceObject["default"].setup(swaggerSpec));
    utils_logger.info('📚 Documentación API disponible en /api-docs');
  }
  // rutas API
  app.use('/api/usuario/', createUsuarioRouter({
    usuarioModel: UsuarioModel
  }));
  app.use('/api/', authenticate, createCentroCosteRouter({
    centroModel: CentroCosteModel
  }));
  app.use('/api/', authenticate, createMezclasRouter({
    mezclaModel: MezclaModel
  }));
  app.use('/api/', authenticate, createProductosRouter({
    productosModel: ProductosModel
  }));
  app.use('/api/', authenticate, createProductosSoliRouter({
    productossModel: SolicitudRecetaModel
  }));
  app.use('/api/', authenticate, createNotificacionesRouter({
    notificacionModel: NotificacionModel
  }));
  app.use('/api/', authenticate, createProduccionRouter({
    produccionModel: ProduccionModel
  }));

  // rutas Protegidas
  app.use('/protected/', authenticate, isGeneral, createProtetedRouter());

  // Rutas para imágenes (antes de las rutas API)
  app.use('/api/', authenticate, createUploadsRouter());

  // Servir archivos estáticos de imágenes
  app.use('/api/uploads/images', authenticate, external_express_namespaceObject["default"]["static"](imagesDir));

  // PAGINA DE Inicio
  app.get('/', (req, res) => {
    res.render('main', {
      error: null,
      registerError: null
    });
  });

  // contenido estatico que ponemos disponible
  app.use(external_express_namespaceObject["default"]["static"]('public'));

  // Manejo de errores 404
  app.use(error404);

  // Manejo de errores 500
  app.use(errorHandler);
  try {
    // Configurar asociaciones antes de sincronizar
    setupAssociations();
    await db.sync();
    utils_logger.info('📦 Base de datos conectada y sincronizada');
    // Iniciamos el servidor en el puerto especificado
    app.listen(PORT, () => utils_logger.info(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    utils_logger.error('❌ Error al iniciar:', error);
    // process.exit(1)
  }
};
;// CONCATENATED MODULE: ./src/app.mjs


(async () => {
  startServer({
    PORT: envs.PORT,
    MODE: envs.MODE
  });
})();

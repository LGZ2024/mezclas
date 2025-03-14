import { Sequelize } from 'sequelize'
import { envs } from '../config/env.mjs'
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
}
const sequelize = new Sequelize(sequelizeConfig)

export default sequelize

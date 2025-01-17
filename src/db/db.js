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
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
const sequelize = new Sequelize(sequelizeConfig)

export default sequelize // Exporta el módulo de Sequelize como valor por defecto

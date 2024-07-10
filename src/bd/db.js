import {createPool} from 'mysql2/promise'
import{envs} from '../config/env.mjs'

//Establecemos los prámetros de conexión
export const conexion= createPool({
    host:envs.DB_HOST,
    user:envs.DB_USER,
    password:envs.DB_PASSWORD,
    database:envs.DB_NAME
})

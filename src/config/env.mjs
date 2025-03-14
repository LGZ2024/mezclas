import env from 'dotenv'
env.config()

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
export const envs = {
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
}

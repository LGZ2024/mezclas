import env from 'dotenv'
env.config()

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
export const envs = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'viajes',
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeXF5bmhhcXF5am1peHdtYWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMzc5MjEsImV4cCI6MjAzMzkxMzkyMX0.9g4wlyxPa9KFzfsjhl0ty_GCNpvrP_4nxvi2ctEdP1M',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}

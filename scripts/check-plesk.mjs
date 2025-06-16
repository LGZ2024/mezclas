import { writeFileSync } from 'fs'
import { join } from 'path'

const checkPleskConfig = () => {
  const config = {
    env: process.env.NODE_ENV,
    plesk: process.env.PLESK_MODE,
    vars: {
      db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        name: process.env.DB_NAME
      },
      email: {
        user: process.env.EMAIL_USER
      }
    },
    cwd: process.cwd()
  }

  // Guardar en archivo para debug
  writeFileSync(
    join(process.cwd(), 'logs', 'plesk-config.json'),
    JSON.stringify(config, null, 2)
  )

  console.log('Configuración:', config)
}

checkPleskConfig()

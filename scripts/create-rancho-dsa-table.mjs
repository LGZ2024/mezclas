import mysql from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración de la base de datos (desde variables de entorno)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fertilizaciones'
}

async function createRanchoDsaTable() {
  let connection

  try {
    console.log('🔄 Conectando a la base de datos...')
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Conexión establecida')

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../sql/rancho_dsa_simple.sql')
    const sqlContent = await fs.readFile(sqlPath, 'utf8')

    console.log('🔄 Ejecutando script SQL para crear tabla rancho_dsa...')

    // Ejecutar el SQL
    await connection.execute(sqlContent)

    console.log('✅ Tabla rancho_dsa creada exitosamente')
    console.log('📋 Estructura de la tabla:')

    // Verificar la estructura de la tabla
    const [rows] = await connection.execute('DESCRIBE rancho_dsa')
    console.table(rows)
  } catch (error) {
    console.error('❌ Error al crear la tabla:', error.message)

    // Si la tabla ya existe, mostrar un mensaje informativo
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  La tabla rancho_dsa ya existe en la base de datos')
    } else {
      process.exit(1)
    }
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Conexión cerrada')
    }
  }
}

// Ejecutar el script
createRanchoDsaTable()
